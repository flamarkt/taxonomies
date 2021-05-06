<?php

namespace Flamarkt\Taxonomies\Validators;

use Flarum\Foundation\AbstractValidator;
use Illuminate\Validation\Rule;

class TaxonomyValidator extends AbstractValidator
{
    public $type;
    public $ignore;

    protected function getRules(): array
    {
        return [
            'type' => 'required|string|in:products,discussions,users',
            'name' => 'required|string|min:1|max:255',
            'slug' => [
                'required',
                'alpha_dash',
                'min:1',
                'max:255',
                Rule::unique('flamarkt_taxonomies', 'slug')
                    ->where('type', $this->type)
                    ->ignore($this->ignore),
            ],
            'description' => 'nullable|string|min:1|max:65535',
            'color' => 'nullable|string|min:3|max:255',
            'icon' => 'nullable|string|min:3|max:255',
            'showLabel' => 'boolean',
            'show_filter' => 'boolean',
            'allow_custom_values' => 'boolean',
            'custom_value_validation' => 'nullable|string|min:3|max:255',
            'custom_value_slugger' => 'nullable|in:random,alpha_dash,transliterator',
            'min_terms' => 'nullable|integer|min:0|max:255',
            'max_terms' => 'nullable|integer|min:0|max:255',
        ];
    }
}
