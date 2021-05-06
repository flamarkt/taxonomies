<?php

namespace Flamarkt\Taxonomies\Api\Controller;

use Flamarkt\Taxonomies\Api\Serializer\TermSerializer;
use Flamarkt\Taxonomies\Repositories\TaxonomyRepository;
use Flamarkt\Taxonomies\Repositories\TermRepository;
use Flamarkt\Taxonomies\Validators\OrderValidator;
use Flarum\Api\Controller\AbstractListController;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class TermOrderController extends AbstractListController
{
    public $serializer = TermSerializer::class;

    protected $validator;
    protected $taxonomies;
    protected $terms;

    public function __construct(OrderValidator $validator, TaxonomyRepository $taxonomies, TermRepository $terms)
    {
        $this->validator = $validator;
        $this->taxonomies = $taxonomies;
        $this->terms = $terms;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $request->getAttribute('actor')->assertAdmin();

        $id = Arr::get($request->getQueryParams(), 'id');

        $taxonomy = $this->taxonomies->findIdOrFail($id);

        $attributes = $request->getParsedBody();

        $this->validator->assertValid($attributes);

        $order = Arr::get($attributes, 'order') ?: [];

        $this->terms->sorting($taxonomy, $order);

        // Return updated order values
        return $this->terms->all($taxonomy);
    }
}
