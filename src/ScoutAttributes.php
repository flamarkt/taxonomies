<?php

namespace Flamarkt\Taxonomies;

use Flarum\Database\AbstractModel;

class ScoutAttributes
{
    public function __invoke(AbstractModel $model): array
    {
        $terms = $model->taxonomyTerms;
        $terms->load('taxonomy');

        $attributes = [];

        foreach ($terms->groupBy('taxonomy_id') as $termsForTaxonomy) {
            /**
             * @var Taxonomy $taxonomy
             */
            $taxonomy = $termsForTaxonomy->first()->taxonomy;

            // In this extension we don't worry about whether guests can see the information
            // since admins have a dedicated setting per-taxonomy for this feature
            if (!$taxonomy->enable_fulltext_search) {
                continue;
            }

            // We only index the name and not description, as that might be a bit too much with very common terms added to the index
            $attributes['taxonomy_' . $taxonomy->slug] = $termsForTaxonomy->pluck('name')->all();
        }

        return $attributes;
    }
}
