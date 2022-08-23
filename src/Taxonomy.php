<?php

namespace Flamarkt\Taxonomies;

use Carbon\Carbon;
use Flarum\Database\AbstractModel;
use Flarum\Database\ScopeVisibilityTrait;
use Flarum\Extension\ExtensionManager;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $type
 * @property string $name
 * @property string $slug
 * @property string $description
 * @property string $color
 * @property string $icon
 * @property int $order
 * @property string $scope
 * @property bool $show_label
 * @property bool $show_filter
 * @property bool $allow_custom_values
 * @property string $custom_value_validation
 * @property string $custom_value_slugger
 * @property int $min_terms
 * @property int $max_terms
 * @property Carbon $created_at
 * @property Carbon $updated_at
 *
 * @property Term[]|Collection $terms
 *
 * @property string[] $tag_ids
 */
class Taxonomy extends AbstractModel
{
    use ScopeVisibilityTrait;

    protected $table = 'flamarkt_taxonomies';

    public $timestamps = true;

    protected $fillable = [
        'type',
        'name',
        'slug',
        'description',
        'color',
        'icon',
        'show_label',
        'show_filter',
        'allow_custom_values',
        'custom_value_validation',
        'custom_value_slugger',
        'min_terms',
        'max_terms',
        'tag_ids',
    ];

    protected $casts = [
        'order' => 'int',
        'show_label' => 'bool',
        'show_filter' => 'bool',
        'allow_custom_values' => 'bool',
        'min_terms' => 'int',
        'max_terms' => 'int',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function terms(): Relations\HasMany
    {
        return $this->hasMany(Term::class);
    }

    public function getTagIdsAttribute(): array
    {
        $ids = [];

        foreach (explode(',', $this->scope ?? '') as $scope) {
            if (Str::startsWith($scope, 'tag:')) {
                $ids[] = substr($scope, 4);
            }
        }

        return $ids;
    }

    public function setTagIdsAttribute($tagIds)
    {
        if (!is_array($tagIds)) {
            $tagIds = [];
        }

        if (count($tagIds) === 0) {
            $this->scope = null;

            return;
        }

        $this->scope = implode(',', array_map(function ($id) {
            return 'tag:' . $id;
        }, $tagIds));
    }

    public function appliesToDiscussion(\Illuminate\Support\Collection $discussionTagIds): bool
    {
        $tagIds = $this->tag_ids;

        // If there are no scopes, it always applies
        if (count($tagIds) === 0) {
            return true;
        }

        $extensionManager = resolve(ExtensionManager::class);

        if (!$extensionManager->isEnabled('flarum-tags')) {
            throw new \Exception('Discussion taxonomy ' . $taxonomy->slug . ' is scoped by tag but tags extension is disabled');
        }

        return $discussionTagIds->intersect($tagIds)->isNotEmpty();
    }
}
