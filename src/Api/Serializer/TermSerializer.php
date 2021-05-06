<?php

namespace Flamarkt\Taxonomies\Api\Serializer;

use Flamarkt\Taxonomies\Term;
use Flarum\Api\Serializer\AbstractSerializer;
use Tobscure\JsonApi\Relationship;

class TermSerializer extends AbstractSerializer
{
    protected $type = 'flamarkt-taxonomy-terms';

    /**
     * @param Term $term
     * @return array
     */
    protected function getDefaultAttributes($term): array
    {
        $attributes = [
            'name' => $term->name,
            'slug' => $term->slug,
            'description' => $term->description,
            'color' => $term->color,
            'icon' => $term->icon,
            'order' => $term->order,
        ];

        if ($this->actor->isAdmin()) {
            $attributes += [
                'createdAt' => $this->formatDate($term->created_at),
            ];
        }

        return $attributes;
    }

    public function taxonomy($term): Relationship
    {
        return $this->hasOne($term, TaxonomySerializer::class);
    }
}
