<?php

namespace Flamarkt\Taxonomies\Api\Serializer;

use Flamarkt\Taxonomies\Taxonomy;
use Flarum\Api\Serializer\AbstractSerializer;

class TaxonomySerializer extends AbstractSerializer
{
    protected $type = 'flamarkt-taxonomies';

    /**
     * @param Taxonomy $taxonomy
     * @return array
     */
    protected function getDefaultAttributes($taxonomy): array
    {
        $attributes = [
            'type' => $taxonomy->type,
            'name' => $taxonomy->name,
            'slug' => $taxonomy->slug,
            'description' => $taxonomy->description,
            'color' => $taxonomy->color,
            'icon' => $taxonomy->icon,
            'order' => $taxonomy->order,
            'showLabel' => $taxonomy->show_label,
            'showFilter' => $taxonomy->show_filter,
            'allowCustomValues' => $taxonomy->allow_custom_values,
            'customValueValidation' => $taxonomy->custom_value_validation,
            'minTerms' => $taxonomy->min_terms,
            'maxTerms' => $taxonomy->max_terms,
            'canSearchDiscussions' => $this->actor->can('searchDiscussions', $taxonomy),
            'canSearchUsers' => $this->actor->can('searchUsers', $taxonomy),
        ];

        if ($this->actor->isAdmin()) {
            $attributes += [
                'customValueSlugger' => $taxonomy->custom_value_slugger,
                'createdAt' => $this->formatDate($taxonomy->created_at),
            ];
        }

        return $attributes;
    }
}
