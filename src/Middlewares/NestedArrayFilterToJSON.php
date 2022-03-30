<?php

namespace Flamarkt\Taxonomies\Middlewares;

use Illuminate\Support\Arr;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class NestedArrayFilterToJSON implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $queryParams = $request->getQueryParams();

        $filter = Arr::get($queryParams, 'filter.taxonomy');

        // It's only useful for the /discussions, /users and /flamarkt/products endpoint
        // But performance-wise, it's less logic to just do it on every request instead of checking the route name
        if ($filter) {
            // Flarum's filter system doesn't support nested arrays, only strings
            // So we'll convert the array into a JSON object that can be decoded in the filter
            $queryParams['filter']['taxonomy'] = json_encode($queryParams['filter']['taxonomy']);

            return $handler->handle($request->withQueryParams($queryParams));
        }

        return $handler->handle($request);
    }
}
