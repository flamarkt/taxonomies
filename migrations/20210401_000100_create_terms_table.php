<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if ($schema->hasTable('fof_taxonomy_terms')) {
            $schema->rename('fof_taxonomy_terms', 'flamarkt_taxonomy_terms');
            return;
        }
        if ($schema->hasTable('gb_taxonomy_terms')) {
            $schema->rename('gb_taxonomy_terms', 'flamarkt_taxonomy_terms');
            return;
        }

        $schema->create('flamarkt_taxonomy_terms', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('taxonomy_id');
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->string('color')->nullable();
            $table->string('icon')->nullable();
            $table->unsignedInteger('order');
            $table->timestamps();

            $table->unique(['taxonomy_id', 'slug']);

            $table->foreign('taxonomy_id')->references('id')->on('flamarkt_taxonomies')->onDelete('cascade');
        });
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('flamarkt_taxonomy_terms');
    },
];
