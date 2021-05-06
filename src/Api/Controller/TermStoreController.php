<?php

namespace Flamarkt\Taxonomies\Api\Controller;

use Flamarkt\Taxonomies\Api\Serializer\TermSerializer;
use Flamarkt\Taxonomies\Repositories\TaxonomyRepository;
use Flamarkt\Taxonomies\Repositories\TermRepository;
use Flarum\Api\Controller\AbstractCreateController;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class TermStoreController extends AbstractCreateController
{
    public $serializer = TermSerializer::class;

    protected $taxonomies;
    protected $terms;

    public function __construct(TaxonomyRepository $taxonomies, TermRepository $terms)
    {
        $this->taxonomies = $taxonomies;
        $this->terms = $terms;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $request->getAttribute('actor')->assertAdmin();

        $id = Arr::get($request->getQueryParams(), 'id');

        $taxonomy = $this->taxonomies->findIdOrFail($id);

        $attributes = Arr::get($request->getParsedBody(), 'data.attributes', []);

        return $this->terms->store($taxonomy, $attributes);
    }
}
