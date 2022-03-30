<?php

namespace Flamarkt\Taxonomies\Exceptions;

use Flarum\Foundation\ErrorHandling\HandledError;
use Flarum\Locale\Translator;

class InvalidFilterTaxonomyHandler
{
    public function handle(InvalidFilterTaxonomy $exception): HandledError
    {
        /**
         * @var $translator Translator
         */
        $translator = resolve(Translator::class);

        return (new HandledError($exception, 'invalid_filter_taxonomy', 400))->withDetails([
            [
                'detail' => $translator->trans('flamarkt-taxonomies.api.error.invalid_filter_taxonomy', [
                    '{type}' => $exception->getTaxonomyType(),
                    '{slug}' => $exception->getTaxonomySlug(),
                ]),
                'source' => [
                    'parameter' => 'filter[taxonomy][' . $exception->getTaxonomySlug() . ']',
                ],
            ],
        ]);
    }
}
