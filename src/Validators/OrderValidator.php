<?php

namespace Flamarkt\Taxonomies\Validators;

use Flarum\Foundation\AbstractValidator;

class OrderValidator extends AbstractValidator
{
    protected function getRules(): array
    {
        return [
            'order' => 'nullable|array',
        ];
    }
}
