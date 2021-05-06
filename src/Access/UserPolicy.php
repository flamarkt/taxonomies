<?php

namespace Flamarkt\Taxonomies\Access;

use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;

class UserPolicy extends AbstractPolicy
{
    public function seeTaxonomy(User $actor, User $user)
    {
        if ($user->id === $actor->id && $actor->hasPermission('user.seeOwnTaxonomy')) {
            return $this->allow();
        }

        return $actor->hasPermission('user.seeAnyTaxonomy');
    }

    public function editTaxonomy(User $actor, User $user)
    {
        if ($user->id === $actor->id && $actor->hasPermission('user.editOwnTaxonomy')) {
            return $this->allow();
        }

        return $actor->hasPermission('user.editAnyTaxonomy');
    }
}
