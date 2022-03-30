<?php

namespace Flamarkt\Taxonomies\Gambits;

class DiscussionTaxonomyGambit extends AbstractTaxonomyGambit
{
    protected $taxonomyType = 'discussions';
    protected $resourceIdKey = 'discussions.id';
    protected $pivotResourceKey = 'discussion_id';
    protected $pivotTable = 'flamarkt_discussion_taxonomy_term';
}
