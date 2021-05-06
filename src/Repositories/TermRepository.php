<?php

namespace Flamarkt\Taxonomies\Repositories;

use Flamarkt\Taxonomies\Taxonomy;
use Flamarkt\Taxonomies\Term;
use Flamarkt\Taxonomies\Validators\TermValidator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class TermRepository
{
    protected $term;
    protected $validator;

    public function __construct(Term $term, TermValidator $validator)
    {
        $this->term = $term;
        $this->validator = $validator;
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

    public function store(Taxonomy $taxonomy, array $attributes): Term
    {
        $this->validator->taxonomyId = $taxonomy->id;
        $this->validator->assertValid($attributes);

        $term = new Term($attributes);
        $term->taxonomy()->associate($taxonomy);
        $term->save();

        return $term;
    }

    public function update(Term $term, array $attributes): Term
    {
        $this->validator->taxonomyId = $term->taxonomy_id;
        $this->validator->ignore = $term;
        $this->validator->assertValid($attributes);

        $term->fill($attributes);
        $term->save();

        return $term;
    }

    public function delete(Term $term)
    {
        $term->delete();
    }

    public function sorting(Taxonomy $taxonomy, array $sorting)
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
