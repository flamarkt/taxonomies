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
            // We need to use forceAllow because the ->deny() returned by flarum-tags scope logic would otherwise take priority
            return $this->forceAllow();
        }

        if ($actor->can('seeAnyTaxonomy', $discussion)) {
            return $this->forceAllow();
        }
    }

    public function editTaxonomy(User $actor, Discussion $discussion)
    {
        // For new discussions, we just check editOwnTaxonomy
        // We can't use the tag-scoped permission here since the discussion won't have its tags saved at this moment
        // The taxonomy+tag validity is still checked with Taxonomy::appliesToDiscussion() in the TaxonomizeModel code
        if (!$discussion->exists && $actor->hasPermission('discussion.editOwnTaxonomy')) {
            return $this->forceAllow();
        }

        // For existing discussions, we check ownership and ability to reply
        if ($discussion->user_id === $actor->id &&
            $actor->can('reply', $discussion) &&
            $actor->can('editOwnTaxonomy', $discussion)) {
            return $this->forceAllow();
        }

        // Check the moderation permission
        if ($actor->can('editAnyTaxonomy', $discussion)) {
            return $this->forceAllow();
        }
    }
}
