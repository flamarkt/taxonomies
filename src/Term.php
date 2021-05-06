<?php

namespace Flamarkt\Taxonomies;

use Carbon\Carbon;
use Flarum\Database\AbstractModel;
use Illuminate\Database\Eloquent\Relations;

/**
 * @property int $id
 * @property int $taxonomy_id
 * @property string $name
 * @property string $slug
 * @property string $description
 * @property string $color
 * @property string $icon
 * @property int $order
 * @property Carbon $created_at
 * @property Carbon $updated_at
 *
 * @property Taxonomy $taxonomy
 */
class Term extends AbstractModel
{
    protected $table = 'flamarkt_taxonomy_terms';

    public $timestamps = true;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'icon',
    ];

    protected $casts = [
        'order' => 'int',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function taxonomy(): Relations\BelongsTo
    {
        return $this->belongsTo(Taxonomy::class);
    }
}
