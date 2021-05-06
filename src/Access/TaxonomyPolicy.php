<?php

namespace Flamarkt\Taxonomies\Access;

use Flamarkt\Taxonomies\Taxonomy;
use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;

class TaxonomyPolicy extends AbstractPolicy
{
    public function canSeeAllTaxonomies(User $actor)
    {
        // For now, it's all or nothing. If you are allowed to see or edit anything, we expose the full list of existing taxonomies
        return $actor->hasPermission('discussion.seeOwnTaxonomy') ||
            $actor->hasPermission('discussion.editOwnTaxonomy') ||
            $actor->hasPermission('user.seeOwnTaxonomy') ||
            $actor->hasPermission('user.editOwnTaxonomy');
    }

    public function searchDiscussions(User $actor, Taxonomy $taxonomy)
    {
        return $taxonomy->type === 'discussions' && $this->canSeeAllTaxonomies($actor);
    }

    public function searchUsers(User $actor, Taxonomy $taxonomy)
    {
        return $taxonomy->type === 'users' && $this->canSeeAllTaxonomies($actor);
    }

    public function listTerms(User $actor, Taxonomy $taxonomy)
    {
        return $this->canSeeAllTaxonomies($actor);
    }
}
