<?php

namespace Flamarkt\Taxonomies\Api\Controller;

use Flamarkt\Taxonomies\Api\Serializer\TermSerializer;
use Flamarkt\Taxonomies\Repositories\TermRepository;
use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class TermUpdateController extends AbstractShowController
{
    public $serializer = TermSerializer::class;

    protected $repository;

    public function __construct(TermRepository $repository)
    {
        $this->repository = $repository;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        RequestUtil::getActor($request)->assertAdmin();

        $id = Arr::get($request->getQueryParams(), 'id');

        $term = $this->repository->findOrFail($id);

        $attributes = Arr::get($request->getParsedBody(), 'data.attributes', []);

        return $this->repository->update($term, $attributes);
    }
}
