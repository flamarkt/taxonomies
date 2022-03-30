<?php

namespace Flamarkt\Taxonomies\Exceptions;

use Exception;

class InvalidFilterTaxonomy extends Exception
{
    protected $taxonomyType;
    protected $taxonomySlug;

    public function __construct(string $type, string $taxonomy)
    {
        parent::__construct();

        $this->taxonomyType = $type;
        $this->taxonomySlug = $taxonomy;
    }

    public function getTaxonomyType(): string
    {
        return $this->taxonomyType;
    }

    public function getTaxonomySlug(): string
    {
        return $this->taxonomySlug;
    }
}
