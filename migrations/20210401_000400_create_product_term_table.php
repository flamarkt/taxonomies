<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    // This feature is provided by flamarkt/backoffice to enable skippable migrations
    'when' => function (Builder $schema) {
        return $schema->hasTable('flamarkt_products');
    },
    'up' => function (Builder $schema) {
        // Fallback message in case there are still issues with optional migrations in flamarkt/backoffice
        // This way the users see a better error instead of a broken database
        if (!$schema->hasTable('flamarkt_products')) {
            throw new \Exception('flamarkt_products table is missing. This code should not have run. This could be an issue with flamarkt/backoffice');
        }

        $schema->create('flamarkt_product_taxonomy_term', function (Blueprint $table) {
            $table->unsignedInteger('product_id');
            $table->unsignedInteger('term_id');
            $table->timestamps();

            $table->primary(['product_id', 'term_id']);

            $table->foreign('product_id')->references('id')->on('flamarkt_products')->onDelete('cascade');
            $table->foreign('term_id')->references('id')->on('flamarkt_taxonomy_terms')->onDelete('cascade');
        });
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('flamarkt_product_taxonomy_term');
    },
];
