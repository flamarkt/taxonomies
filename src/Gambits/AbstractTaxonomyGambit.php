<?php

namespace Flamarkt\Taxonomies\Gambits;

use Flamarkt\Taxonomies\Exceptions\InvalidFilterTaxonomy;
use Flamarkt\Taxonomies\Repositories\TaxonomyRepository;
use Flarum\Filter\FilterInterface;
use Flarum\Filter\FilterState;
use Flarum\Search\AbstractRegexGambit;
use Flarum\Search\SearchState;
use Flarum\User\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Query\Builder;

abstract class AbstractTaxonomyGambit extends AbstractRegexGambit implements FilterInterface
{
    protected $taxonomyType;
    protected $resourceIdKey;
    protected $pivotResourceKey;
    protected $pivotTable;

    public function getGambitPattern(): string
    {
        return 'taxonomy:(.+):(.+)';
    }

    protected function conditions(SearchState $search, array $matches, $negate)
    {
        $this->constrain(
            $search->getQuery(),
            $search->getActor(),
            trim($matches[1], '"'),
            trim($matches[2], '"'),
            $negate
        );
    }

    public function getFilterKey(): string
    {
        return 'taxonomy';
    }

    public function filter(FilterState $filterState, string $filterValue, bool $negate)
    {
        // The value was encoded to JSON in the middleware to work around Flarum's string-only limitation
        $nestedValue = json_decode($filterValue, true);

        if (is_array($nestedValue)) {
            foreach ($nestedValue as $key => $value) {
                $this->constrain(
                    $filterState->getQuery(),
                    $filterState->getActor(),
                    $key,
                    $value,
                    $negate
                );
            }
        }
    }

    protected function constrain(Builder $query, User $actor, string $taxonomySlug, string $commaSeparatedTermSlugs, bool $negate)
    {
        $termSlugs = explode(',', $commaSeparatedTermSlugs);

        /**
         * @var TaxonomyRepository $repository
         */
        $repository = resolve(TaxonomyRepository::class);

        try {
            $taxonomy = $repository->findSlugOrFail($taxonomySlug, $this->taxonomyType);
        } catch (ModelNotFoundException $exception) {
            throw new InvalidFilterTaxonomy($this->taxonomyType, $taxonomySlug);
        }

        $actor->assertCan('search', $taxonomy);

        $termIdsMap = $taxonomy->terms()
            ->whereIn('slug', $termSlugs)
            ->pluck('id', 'slug');

        $query->where(function (Builder $query) use ($termSlugs, $termIdsMap, $negate) {
            foreach ($termSlugs as $slug) {
                if ($slug === 'untagged') {
                    $query->whereIn($this->resourceIdKey, function (Builder $query) {
                        $query->select($this->pivotResourceKey)
                            ->from($this->pivotTable);
                    }, 'or', !$negate);
                } else {
                    $id = $termIdsMap->get($slug);

                    $query->whereIn($this->resourceIdKey, function (Builder $query) use ($id) {
                        $query->select($this->pivotResourceKey)
                            ->from($this->pivotTable)
                            ->where('term_id', $id);
                    }, 'or', $negate);
                }
            }
        });
    }
}
