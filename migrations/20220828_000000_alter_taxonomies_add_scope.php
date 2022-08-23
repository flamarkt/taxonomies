<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('flamarkt_taxonomies', function (Blueprint $table) {
            $table->string('scope')->after('order')->nullable();
        });
    },
    'down' => function (Builder $schema) {
        if (!$schema->hasColumn('flamarkt_taxonomies', 'scope')) {
            return;
        }

        $schema->table('flamarkt_taxonomies', function (Blueprint $table) {
            $table->dropColumn('scope');
        });
    },
];
