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

    protected function query(): Builder
    {
        return $this->taxonomy->newQuery()
            ->orderBy('order')
            ->orderBy('name');
    }

    /**
     * @param $id
     * @param string $type
     * @return Model|Taxonomy
     */
    public function findIdOrFail($id, $type = null): Taxonomy
    {
        $query = $this->taxonomy->newQuery();

        if ($type) {
            $query->where('type', $type);
        }

        return $query->findOrFail($id);
    }

    /**
     * @param string $slug
     * @param string $type
     * @return Model|Taxonomy
     */
    public function findSlugOrFail(string $slug, $type = null): Taxonomy
    {
        $query = $this->taxonomy->newQuery();

        if ($type) {
            $query->where('type', $type);
        }

        return $query->where('slug', $slug)->firstOrFail();
    }

    /**
     * @return Collection|Taxonomy[]
     */
    public function all(): Collection
    {
        return $this->query()->get();
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

    public function sorting(User $actor, array $order)
    {
        $this->taxonomy->newQuery()->update([
            'order' => null,
        ]);

        foreach ($order as $index => $taxonomyId) {
            $this->taxonomy
                ->newQuery()
                ->where('id', $taxonomyId)
                ->update(['order' => $index + 1]);
        }
    }
}
