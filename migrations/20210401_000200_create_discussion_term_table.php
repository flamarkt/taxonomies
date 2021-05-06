<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if ($schema->hasTable('fof_discussion_taxonomy_term')) {
            $schema->rename('fof_discussion_taxonomy_term', 'flamarkt_discussion_taxonomy_term');
            return;
        }

        $schema->create('flamarkt_discussion_taxonomy_term', function (Blueprint $table) {
            $table->unsignedInteger('discussion_id');
            $table->unsignedInteger('term_id');
            $table->timestamps();

            $table->primary(['discussion_id', 'term_id']);

            $table->foreign('discussion_id')->references('id')->on('discussions')->onDelete('cascade');
            $table->foreign('term_id')->references('id')->on('flamarkt_taxonomy_terms')->onDelete('cascade');
        });
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('flamarkt_discussion_taxonomy_term');
    },
];
