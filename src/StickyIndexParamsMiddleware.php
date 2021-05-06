<?php

namespace Flamarkt\Taxonomies;

use Illuminate\Support\Arr;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class StickyIndexParamsMiddleware implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        // Only do this on pages we know will render a discussion list
        if (!in_array($request->getAttribute('routeName'), [
            'default', //TODO: this could interfere on custom homepages that use query strings
            'index',
            'following',
            'tag',
        ])) {
            return $handler->handle($request);
        }

        $queryParams = $request->getQueryParams();

        // We don't check those known parameters against taxonomy slugs
        // Doing this allows us to skip a database request if no other parameter is present
        // Also replacing those parameters would most certainly break something
        $possibleTaxonomyParams = Arr::except(array_keys($queryParams), [
            'sort',
            'q',
            'page',
            'slug', // Will be part of the query params when showing a tag page
        ]);

        if (count($possibleTaxonomyParams)) {
            $q = Arr::get($queryParams, 'q', '');

            /**
             * @var $taxonomies Taxonomy[]
             */
            $taxonomies = Taxonomy::query()
                ->whereIn('slug', $possibleTaxonomyParams)
                ->where('show_filter', true)
                ->get();

            foreach ($taxonomies as $taxonomy) {
                //TODO: switch to filter when no q
                $q = "$q taxonomy:{$taxonomy->slug}:" . Arr::pull($queryParams, $taxonomy->slug);
            }

            $queryParams['q'] = $q;
        }

        return $handler->handle($request->withQueryParams($queryParams));
    }
}
