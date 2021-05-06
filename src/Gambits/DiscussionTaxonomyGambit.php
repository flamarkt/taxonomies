<?php

namespace Flamarkt\Taxonomies\Gambits;

use Flamarkt\Taxonomies\Repositories\TaxonomyRepository;
use Flarum\Filter\FilterInterface;
use Flarum\Filter\FilterState;
use Flarum\Search\AbstractRegexGambit;
use Flarum\Search\SearchState;
use Flarum\User\User;
use Illuminate\Database\Query\Builder;

class DiscussionTaxonomyGambit extends AbstractRegexGambit implements FilterInterface
{
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
        $this->constrain(
            $filterState->getQuery(),
            $filterState->getActor(),
            'todo', //TODO: decide how to implement filters
            $filterValue,
            $negate
        );
    }

    protected function constrain(Builder $query, User $actor, string $taxonomySlug, string $commaSeparatedTermSlugs, bool $negate)
    {
        $termSlugs = explode(',', $commaSeparatedTermSlugs);

        /**
         * @var TaxonomyRepository $repository
         */
        $repository = resolve(TaxonomyRepository::class);

        $taxonomy = $repository->findSlugOrFail($taxonomySlug, 'discussions');

        $actor->assertCan('searchDiscussions', $taxonomy);

        $termIdsMap = $taxonomy->terms()
            ->whereIn('slug', $termSlugs)
            ->pluck('id', 'slug');

        $query->where(function (Builder $query) use ($termSlugs, $termIdsMap, $negate) {
            foreach ($termSlugs as $slug) {
                if ($slug === 'untagged') {
                    $query->whereIn('discussions.id', function (Builder $query) {
                        $query->select('discussion_id')
                            ->from('flamarkt_discussion_taxonomy_term');
                    }, 'or', !$negate);
                } else {
                    $id = $termIdsMap->get($slug);

                    $query->whereIn('discussions.id', function (Builder $query) use ($id) {
                        $query->select('discussion_id')
                            ->from('flamarkt_discussion_taxonomy_term')
                            ->where('term_id', $id);
                    }, 'or', $negate);
                }
            }
        });
    }
}
