<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
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
