# Taxonomies

Taxonomies for Flarum discussions, users and Flamarkt products.

The extension can be used with or without Flamarkt installed.

# Installation

    composer require flamarkt/taxonomies

1. Go to admin panel, enable the *Backoffice* extension.
2. Go to Backoffice, enable *Taxonomies* extension.
3. Click Taxonomies at the top of the Backoffice sidebar to configure.

Permissions are only visible from admin panel and not backoffice at the moment, this should be fixed in the next Backoffice update.

Taxonomy management is currently hard-coded to admin only, but it will be aligned with the Backoffice permission in a future version.

If you install Flamarkt in the future, you might need to run `php flarum migrate` via SSH to finish the integration between the 2 extensions.
