<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('flamarkt_taxonomies', function (Blueprint $table) {
            $table->boolean('enable_fulltext_search')->after('show_filter')->default(false);
            $table->boolean('enable_filter')->after('show_filter')->default(false);
        });

        // Copy value of show_filter into enable_filter for existing taxonomies
        $schema->getConnection()->table('flamarkt_taxonomies')->update([
            'enable_filter' => $schema->getConnection()->raw('show_filter'),
        ]);
    },
    'down' => function (Builder $schema) {
        if ($schema->hasColumn('flamarkt_taxonomies', 'enable_fulltext_search')) {
            $schema->table('flamarkt_taxonomies', function (Blueprint $table) {
                $table->dropColumn('enable_fulltext_search');
            });
        }

        if ($schema->hasColumn('flamarkt_taxonomies', 'enable_filter')) {
            $schema->table('flamarkt_taxonomies', function (Blueprint $table) {
                $table->dropColumn('enable_filter');
            });
        }
    },
];
