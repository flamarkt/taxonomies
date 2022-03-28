<?php

namespace Flamarkt\Taxonomies\Repositories;

use Flamarkt\Taxonomies\Events\Term\Created;
use Flamarkt\Taxonomies\Events\Term\Deleted;
use Flamarkt\Taxonomies\Taxonomy;
use Flamarkt\Taxonomies\Term;
use Flamarkt\Taxonomies\Validators\TermValidator;
use Flarum\User\User;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class TermRepository
{
    protected $term;
    protected $validator;
    protected $events;

    public function __construct(Term $term, TermValidator $validator, Dispatcher $events)
    {
        $this->term = $term;
        $this->validator = $validator;
        $this->events = $events;
    }

    protected function query(): Builder
    {
        return $this->term->newQuery()
            ->orderBy('order')
            ->orderBy('name');
    }

    /**
     * @param $id
     * @return Model|Term
     */
    public function findOrFail($id): Term
    {
        return $this->term->newQuery()->findOrFail($id);
    }

    /**
     * @param Taxonomy $taxonomy
     * @return Collection|Term[]
     */
    public function all(Taxonomy $taxonomy): Collection
    {
        return $this->query()
            ->where('taxonomy_id', $taxonomy->id)
            ->get();
    }

    public function store(User $actor, Taxonomy $taxonomy, array $attributes): Term
    {
        $this->validator->taxonomyId = $taxonomy->id;
        $this->validator->assertValid($attributes);

        $term = new Term($attributes);
        $term->taxonomy()->associate($taxonomy);
        $term->save();

        $this->events->dispatch(new Created($term, $actor, $attributes));

        return $term;
    }

    public function update(User $actor, Term $term, array $attributes): Term
    {
        $this->validator->taxonomyId = $term->taxonomy_id;
        $this->validator->ignore = $term;
        $this->validator->assertValid($attributes);

        $term->fill($attributes);
        $term->save();

        return $term;
    }

    public function delete(User $actor, Term $term)
    {
        $term->delete();

        $this->events->dispatch(new Deleted($term, $actor, []));
    }

    public function sorting(User $actor, Taxonomy $taxonomy, array $sorting)
    {
        $taxonomy->terms()->update([
            'order' => null,
        ]);

        foreach ($sorting as $index => $termId) {
            $this->term
                ->newQuery()
                ->where('id', $termId)
                ->update(['order' => $index + 1]); // +1 to avoid zero which has same priority as null in javascript
        }
    }
}
