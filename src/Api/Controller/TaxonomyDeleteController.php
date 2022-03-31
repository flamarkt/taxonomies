<?php

namespace Flamarkt\Taxonomies\Api\Controller;

use Flamarkt\Taxonomies\Repositories\TaxonomyRepository;
use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

class TaxonomyDeleteController extends AbstractDeleteController
{
    protected $repository;

    public function __construct(TaxonomyRepository $repository)
    {
        $this->repository = $repository;
    }

    protected function delete(ServerRequestInterface $request)
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertCan('taxonomies.moderate');

        $id = Arr::get($request->getQueryParams(), 'id');

        $taxonomy = $this->repository->findIdOrFail($id);

        $this->repository->delete($actor, $taxonomy);
    }
}
