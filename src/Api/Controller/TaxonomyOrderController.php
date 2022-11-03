<?php

namespace Flamarkt\Taxonomies\Api\Controller;

use Flamarkt\Taxonomies\Api\Serializer\TaxonomySerializer;
use Flamarkt\Taxonomies\Repositories\TaxonomyRepository;
use Flamarkt\Taxonomies\Validators\OrderValidator;
use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class TaxonomyOrderController extends AbstractListController
{
    public $serializer = TaxonomySerializer::class;

    protected $validator;
    protected $repository;

    public function __construct(OrderValidator $validator, TaxonomyRepository $repository)
    {
        $this->validator = $validator;
        $this->repository = $repository;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertCan('taxonomies.moderate');

        $attributes = $request->getParsedBody();

        $this->validator->assertValid($attributes);

        $order = (array)Arr::get($attributes, 'order');
        $type = (string)Arr::get($attributes, 'type') ?: null;

        $this->repository->sorting($actor, $order, $type);

        // Return updated order values
        return $this->repository->all($type);
    }
}
