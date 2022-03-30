<?php

namespace Flamarkt\Taxonomies\Gambits;

class UserTaxonomyGambit extends AbstractTaxonomyGambit
{
    protected $taxonomyType = 'users';
    protected $resourceIdKey = 'users.id';
    protected $pivotResourceKey = 'user_id';
    protected $pivotTable = 'flamarkt_taxonomy_term_user';
}
