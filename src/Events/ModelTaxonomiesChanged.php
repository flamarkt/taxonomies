<?php

namespace Flamarkt\Taxonomies\Events;

use Flamarkt\Core\Product\Product;
use Flamarkt\Taxonomies\Taxonomy;
use Flarum\Database\AbstractModel;
use Flarum\Discussion\Discussion;
use Flarum\User\User;

/**
 * When a connected model's taxonomy terms are modified.
 * The same event is dispatched for any of the compatible models! Use instanceof check on $event->model to check for the model you're interested in
 */
class ModelTaxonomiesChanged
{
    /**
     * @var Discussion|User|Product
     */
    public $model;
    public $taxonomy;
    public $oldTermIds;
    public $actor;

    public function __construct(AbstractModel $model, Taxonomy $taxonomy, array $oldTermIds, User $actor = null)
    {
        $this->model = $model;
        $this->taxonomy = $taxonomy;
        $this->oldTermIds = $oldTermIds;
        $this->actor = $actor;
    }
}
