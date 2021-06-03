<?php

namespace Flamarkt\Taxonomies\Api\Controller;

use Flamarkt\Taxonomies\Api\Serializer\TaxonomySerializer;
use Flamarkt\Taxonomies\Repositories\TaxonomyRepository;
use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class TaxonomyUpdateController extends AbstractShowController
{
    public $serializer = TaxonomySerializer::class;

    protected $repository;

    public function __construct(TaxonomyRepository $repository)
    {
        $this->repository = $repository;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        RequestUtil::getActor($request)->assertAdmin();

        $id = Arr::get($request->getQueryParams(), 'id');

        $taxonomy = $this->repository->findIdOrFail($id);

        $attributes = Arr::get($request->getParsedBody(), 'data.attributes', []);

        return $this->repository->update($taxonomy, $attributes);
    }
}
