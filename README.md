# Taxonomies

Taxonomies for Flarum discussions, users and Flamarkt products.

The extension can be used with or without Flamarkt installed.

# Installation

    composer require flamarkt/taxonomies

1. Go to admin panel, enable the *Backoffice* extension.
2. Go to Backoffice, enable *Taxonomies* extension.
3. Click Taxonomies at the top of the Backoffice sidebar to configure.

If you install Flamarkt in the future, you might need to run `php flarum migrate` via SSH to finish the integration between the 2 extensions.

All types of taxonomies are currently shown on a single page without proper separation.
Dedicated pages will be introduced in a future release.
