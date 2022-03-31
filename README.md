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

# Known issues

The backoffice for terms management is currently not paginated.
This can lead to backoffice performance issues with large numbers of terms, which is more likely to happen when custom values are allowed.

Changing the forum homepage can lead to issues.
Setting the homepage to user list of product list will likely lead to problems.
Setting the homepage to custom pages that aren't a searchable list of resources should be fine.

The list of available taxonomies and terms will be leaked by the REST API to any user allowed to use any of them.
This includes the user taxonomies even if the user is only allowed to edit discussion taxonomies and vice-versa.

Flamarkt Product support is still a work in progress.
