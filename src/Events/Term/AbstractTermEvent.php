<?php

namespace Flamarkt\Taxonomies\Events\Term;

use Flamarkt\Taxonomies\Term;
use Flarum\User\User;

abstract class AbstractTermEvent
{
    /**
     * @var Term
     */
    public $term;

    /**
     * @var User
     */
    public $actor;

    /**
     * @var array
     */
    public $data;

    /**
     * @param Term $term
     * @param User $actor
     * @param array $data
     */
    public function __construct(Term $term, User $actor, array $data)
    {
        $this->term = $term;
        $this->actor = $actor;
        $this->data = $data;
    }
}
