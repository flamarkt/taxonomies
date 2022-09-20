<?php

namespace Flamarkt\Taxonomies\Middlewares;

use Flamarkt\Taxonomies\Taxonomy;
use Flarum\Extension\ExtensionManager;
use Illuminate\Support\Arr;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class StickyDiscussionParams implements MiddlewareInterface
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
        $possibleTaxonomyParams = array_diff(array_keys($queryParams), $this->knownQueryParameters());

        if (count($possibleTaxonomyParams) === 0) {
            return $handler->handle($request);
        }

        $q = Arr::get($queryParams, 'q', '');

        /**
         * @var $taxonomies Taxonomy[]
         */
        $taxonomies = Taxonomy::query()
            ->where('type', 'discussions')
            ->whereIn('slug', $possibleTaxonomyParams)
            ->where('show_filter', true)
            ->get();

        foreach ($taxonomies as $taxonomy) {
            $value = Arr::pull($queryParams, $taxonomy->slug);

            $queryParams['filter']['taxonomy'][$taxonomy->slug] = $value;

            if ($q) {
                $q = "$q taxonomy:{$taxonomy->slug}:" . $value;
            }
        }

        if ($q) {
            $queryParams['q'] = $q;
        }

        return $handler->handle($request->withQueryParams($queryParams));
    }

    protected function knownQueryParameters(): array
    {
        $extensions = resolve(ExtensionManager::class);

        $params = [
            'sort',
            'q',
            'page',
        ];

        if ($extensions->isEnabled('flarum-tags')) {
            // Will be part of the query params when showing a tag page
            $params[] = 'slug';
        }

        if ($extensions->isEnabled('fof-discussion-language')) {
            $params[] = 'language';
        }

        return $params;
    }
}
