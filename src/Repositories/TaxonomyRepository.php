<?php

namespace Flamarkt\Taxonomies\Repositories;

use Flamarkt\Taxonomies\Events\Taxonomy\Created;
use Flamarkt\Taxonomies\Events\Taxonomy\Deleted;
use Flamarkt\Taxonomies\Taxonomy;
use Flamarkt\Taxonomies\Validators\TaxonomyValidator;
use Flarum\Foundation\ValidationException;
use Flarum\User\User;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

class TaxonomyRepository
{
    protected $taxonomy;
    protected $validator;
    protected $events;

    public function __construct(Taxonomy $taxonomy, TaxonomyValidator $validator, Dispatcher $events)
    {
        $this->taxonomy = $taxonomy;
        $this->validator = $validator;
        $this->events = $events;
    }

    /**
     * Start a new query for the given type or all taxonomies
     * @param string|null $type
     * @return Builder
     */
    protected function query(string $type = null): Builder
    {
        return $this->taxonomy->newQuery()
            ->orderBy('order')
            ->orderBy('name')
            ->tap(function (Builder $query) use ($type) {
                if ($type) {
                    $query->where('type', $type);
                }
            });
    }

    /**
     * @param $id
     * @param string|null $type
     * @return Model|Taxonomy
     */
    public function findIdOrFail($id, string $type = null): Taxonomy
    {
        return $this->query($type)->findOrFail($id);
    }

    /**
     * @param string $slug
     * @param string|null $type
     * @return Model|Taxonomy
     */
    public function findSlugOrFail(string $slug, string $type = null): Taxonomy
    {
        return $this->query($type)->where('slug', $slug)->firstOrFail();
    }

    /**
     * @param string|null $type Optionally limit to taxonomies of a given type
     * @return Collection|Taxonomy[]
     */
    public function all(string $type = null): Collection
    {
        return $this->query($type)->get();
    }

    public function store(User $actor, array $attributes): Taxonomy
    {
        $this->validator->type = Arr::get($attributes, 'type');
        $this->validator->assertValid($attributes);

        $taxonomy = new Taxonomy($attributes);
        $taxonomy->save();

        $this->events->dispatch(new Created($taxonomy, $actor, $attributes));

        return $taxonomy;
    }

    public function update(User $actor, Taxonomy $taxonomy, array $attributes): Taxonomy
    {
        $this->validator->type = $taxonomy->type;
        $this->validator->ignore = $taxonomy;
        $this->validator->assertValid($attributes);

        $taxonomy->fill($attributes);

        if ($taxonomy->isDirty('type')) {
            throw new ValidationException([
                // Not translated on purpose. This message should never show up because the UI doesn't offer the field for edit
                'type' => 'Cannot change type of existing taxonomy',
            ]);
        }

        $taxonomy->save();

        return $taxonomy;
    }

    public function delete(User $actor, Taxonomy $taxonomy)
    {
        $taxonomy->delete();

        $this->events->dispatch(new Deleted($taxonomy, $actor, []));
    }

    public function sorting(User $actor, array $order, string $type = null)
    {
        $this->query($type)->update([
            'order' => null,
        ]);

        foreach ($order as $index => $taxonomyId) {
            $this->query($type)
                ->where('id', $taxonomyId)
                ->update(['order' => $index + 1]);
        }
    }
}
