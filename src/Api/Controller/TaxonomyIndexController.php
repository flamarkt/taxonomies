<?php

namespace Flamarkt\Taxonomies\Api\Controller;

use Flamarkt\Taxonomies\Api\Serializer\TaxonomySerializer;
use Flamarkt\Taxonomies\Repositories\TaxonomyRepository;
use Flarum\Api\Controller\AbstractListController;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class TaxonomyIndexController extends AbstractListController
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

        return $this->repository->all();
    }
}
