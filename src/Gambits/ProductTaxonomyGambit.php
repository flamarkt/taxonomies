<?php

namespace Flamarkt\Taxonomies\Gambits;

class ProductTaxonomyGambit extends AbstractTaxonomyGambit
{
    protected $taxonomyType = 'products';
    protected $resourceIdKey = 'flamarkt_products.id';
    protected $pivotResourceKey = 'product_id';
    protected $pivotTable = 'flamarkt_product_taxonomy_term';
}
