<?php

namespace Flamarkt\Taxonomies\Access;

use Flarum\Discussion\Discussion;
use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;

class DiscussionPolicy extends AbstractPolicy
{
    public function seeTaxonomy(User $actor, Discussion $discussion)
    {
        if ($discussion->user_id === $actor->id && $actor->can('seeOwnTaxonomy', $discussion)) {
            return $this->allow();
        }

        return $actor->can('seeAnyTaxonomy', $discussion);
    }

    public function editTaxonomy(User $actor, Discussion $discussion)
    {
        // For new discussions, we just check editOwnTaxonomy
        if (!$discussion->exists && $actor->hasPermission('discussion.editOwnTaxonomy')) {
            return $this->allow();
        }

        // For existing discussions, we check ownership and ability to reply
        if ($discussion->user_id === $actor->id &&
            $actor->can('reply', $discussion) &&
            $actor->can('editOwnTaxonomy', $discussion)) {
            return $this->allow();
        }

        // Check the moderation permission
        return $actor->can('editAnyTaxonomy', $discussion);
    }
}
