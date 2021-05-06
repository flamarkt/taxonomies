<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if ($schema->hasTable('fof_taxonomies')) {
            $schema->rename('fof_taxonomies', 'flamarkt_taxonomies');
            return;
        }

        $schema->create('flamarkt_taxonomies', function (Blueprint $table) {
            $table->increments('id');
            $table->string('type')->default('products');
            $table->string('name');
            $table->string('slug')->index();
            $table->text('description')->nullable();
            $table->string('color')->nullable();
            $table->string('icon')->nullable();
            $table->unsignedInteger('order');
            $table->boolean('show_label')->default(false);
            $table->boolean('show_filter')->default(false);
            $table->boolean('allow_custom_values')->default(false);
            $table->string('custom_value_validation')->nullable();
            $table->string('custom_value_slugger')->nullable();
            $table->unsignedInteger('min_terms')->nullable();
            $table->unsignedInteger('max_terms')->nullable();
            $table->timestamps();

            $table->unique(['type', 'slug']);
        });
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('flamarkt_taxonomies');
    },
];
