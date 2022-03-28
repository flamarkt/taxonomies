<?php

namespace Flamarkt\Taxonomies\Events\Taxonomy;

use Flamarkt\Taxonomies\Taxonomy;
use Flarum\User\User;

abstract class AbstractTaxonomyEvent
{
    /**
     * @var Taxonomy
     */
    public $taxonomy;

    /**
     * @var User
     */
    public $actor;

    /**
     * @var array
     */
    public $data;

    /**
     * @param Taxonomy $taxonomy
     * @param User $actor
     * @param array $data
     */
    public function __construct(Taxonomy $taxonomy, User $actor, array $data)
    {
        $this->taxonomy = $taxonomy;
        $this->actor = $actor;
        $this->data = $data;
    }
}
