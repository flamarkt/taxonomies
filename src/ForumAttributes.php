<?php

namespace Flamarkt\Taxonomies;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Group\Permission;

class ForumAttributes
{
    public function __invoke(ForumSerializer $serializer): array
    {
        if ($serializer->getActor()->cannot('taxonomies.moderate')) {
            return [];
        }

        $permissions = Permission::query()->whereIn('permission', [
            'viewForum',
            'searchUsers',
            'discussion.seeAnyTaxonomy',
            'user.seeAnyTaxonomy',
        ])->orderBy('permission')->orderBy('group_id')->get();

        $groupsPerPermission = $permissions->groupBy('permission')->mapWithKeys(function ($permissions) {
            return [
                $permissions[0]->permission => $permissions->pluck('group_id')->values()->all(),
            ];
        });

        return [
            'taxonomiesFulltextAccessDiffersFromFilter' => [
                $groupsPerPermission->all(),
                // It doesn't really matter which group ID maps to which privilege,
                // if it's different it's enough of a red flag to show a warning to the user if they attempt to use the fulltext search setting
                // If a setting is set to admin (missing), it'll just be `null` and works for the comparison as well
                'discussions' => $groupsPerPermission->get('discussion.seeAnyTaxonomy') !== $groupsPerPermission->get('viewForum'),
                'users' => $groupsPerPermission->get('user.seeAnyTaxonomy') !== $groupsPerPermission->get('searchUsers'),
                'products' => false, // Products currently don't have customizable permissions, so guests always see taxonomies already
            ],
        ];
    }
}
