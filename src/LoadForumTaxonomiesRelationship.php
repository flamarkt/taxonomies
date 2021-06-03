<?php

namespace Flamarkt\Taxonomies;

use Flamarkt\Taxonomies\Repositories\TaxonomyRepository;
use Flarum\Api\Controller\ShowForumController;
use Flarum\Http\RequestUtil;
use Psr\Http\Message\ServerRequestInterface;

class LoadForumTaxonomiesRelationship
{
    public function __invoke(ShowForumController $controller, &$data, ServerRequestInterface $request)
    {
        if (RequestUtil::getActor($request)->can('canSeeAllTaxonomies', Taxonomy::class)) {
            /**
             * @var TaxonomyRepository $taxonomies
             */
            $taxonomies = resolve(TaxonomyRepository::class);

            $data['taxonomies'] = $taxonomies->all();
        } else {
            $data['taxonomies'] = [];
        }
    }
}
