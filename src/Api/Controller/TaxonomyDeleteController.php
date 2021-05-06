<?php

namespace Flamarkt\Taxonomies\Api\Controller;

use Flamarkt\Taxonomies\Repositories\TaxonomyRepository;
use Flarum\Api\Controller\AbstractDeleteController;
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
        $request->getAttribute('actor')->assertAdmin();

        $id = Arr::get($request->getQueryParams(), 'id');

        $taxonomy = $this->repository->findIdOrFail($id);

        $this->repository->delete($taxonomy);
    }
}
