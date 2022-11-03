<?php

namespace Flamarkt\Taxonomies\Access;

use Flamarkt\Taxonomies\Taxonomy;
use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;

class TaxonomyPolicy extends AbstractPolicy
{
    public function canSeeAllTaxonomies(User $actor): bool
    {
        // For now, it's all or nothing. If you are allowed to see or edit anything, we expose the full list of existing taxonomies
        return $actor->hasPermission('taxonomies.moderate') ||
            $actor->hasPermission('discussion.seeAnyTaxonomy') ||
            $actor->hasPermission('discussion.seeOwnTaxonomy') ||
            $actor->hasPermission('discussion.editOwnTaxonomy') ||
            $actor->hasPermission('user.seeAnyTaxonomy') ||
            $actor->hasPermission('user.seeOwnTaxonomy') ||
            $actor->hasPermission('user.editOwnTaxonomy');
    }

    public function search(User $actor, Taxonomy $taxonomy)
    {
        // Moderators can always filter. This is needed for admin/backoffice filters
        if ($actor->hasPermission('taxonomies.moderate')) {
            return $this->allow();
        }

        // If the setting was not enabled on the taxonomy, no need to even check permissions
        if (!$taxonomy->enable_filter) {
            return $this->deny();
        }

        // Only allow searching if the user can see taxonomies of the type's models
        // Otherwise information from hidden taxonomies on public content could be leaked through guessing
        switch ($taxonomy->type) {
            case 'discussions':
                return $actor->hasPermission('discussion.seeAnyTaxonomy');
            case 'users':
                return $actor->hasPermission('user.seeAnyTaxonomy');
            case 'products':
                // Products currently don't have permissions, guests can always see them
                return $this->allow();
        }

        return $this->deny();
    }

    public function listTerms(User $actor, Taxonomy $taxonomy): bool
    {
        return $this->canSeeAllTaxonomies($actor);
    }

    public function bypassTermCounts(User $actor, Taxonomy $taxonomy): bool
    {
        return $actor->hasPermission('taxonomies.bypassTermCounts');
    }
}
