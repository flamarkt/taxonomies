<?php

namespace Flamarkt\Taxonomies\Api\Controller;

use Flamarkt\Taxonomies\Api\Serializer\TermSerializer;
use Flamarkt\Taxonomies\Repositories\TaxonomyRepository;
use Flamarkt\Taxonomies\Repositories\TermRepository;
use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class TermIndexController extends AbstractListController
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
        $id = Arr::get($request->getQueryParams(), 'id');

        $taxonomy = $this->taxonomies->findIdOrFail($id);

        RequestUtil::getActor($request)->assertCan('listTerms', $taxonomy);

        // TODO: implement pagination & search
        // The endpoint currently returns all terms all of the time
        return $this->terms->all($taxonomy);
    }
}
