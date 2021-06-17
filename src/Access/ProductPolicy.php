<?php

namespace Flamarkt\Taxonomies\Access;

use Flamarkt\Core\Product\Product;
use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;

class ProductPolicy extends AbstractPolicy
{
    public function seeTaxonomy(User $actor, Product $product)
    {
        // TODO: permission
        return $this->allow();
    }

    public function editTaxonomy(User $actor, Product $product)
    {
        return $actor->can('backoffice');
    }
}
