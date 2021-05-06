<?php

namespace Flamarkt\Taxonomies\Api\Controller;

use Flamarkt\Taxonomies\Api\Serializer\TaxonomySerializer;
use Flamarkt\Taxonomies\Repositories\TaxonomyRepository;
use Flarum\Api\Controller\AbstractCreateController;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class TaxonomyStoreController extends AbstractCreateController
{
    public $serializer = TaxonomySerializer::class;

    protected $repository;

    public function __construct(TaxonomyRepository $repository)
    {
        $this->repository = $repository;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $request->getAttribute('actor')->assertAdmin();

        $attributes = Arr::get($request->getParsedBody(), 'data.attributes', []);

        return $this->repository->store($attributes);
    }
}
