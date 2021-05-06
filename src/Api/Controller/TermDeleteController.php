<?php

namespace Flamarkt\Taxonomies\Api\Controller;

use Flamarkt\Taxonomies\Repositories\TermRepository;
use Flarum\Api\Controller\AbstractDeleteController;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

class TermDeleteController extends AbstractDeleteController
{
    protected $repository;

    public function __construct(TermRepository $repository)
    {
        $this->repository = $repository;
    }

    protected function delete(ServerRequestInterface $request)
    {
        $request->getAttribute('actor')->assertAdmin();

        $id = Arr::get($request->getQueryParams(), 'id');

        $term = $this->repository->findOrFail($id);

        $this->repository->delete($term);
    }
}
