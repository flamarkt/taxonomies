# Taxonomies

Taxonomies for Flarum discussions, users and Flamarkt products.

The extension can be used with or without Flamarkt installed.

## Installation

This extension will follow the future Flamarkt release cycles with possibly a few major `0.x` versions during the beta.
While this extension is pretty stable, manual operations might still be required between major versions.
For this reason I recommend using the `^` requirement (that's what the command below will use) and not `*`, so you don't accidentally update without reading this README in the future.

    composer require flamarkt/taxonomies

1. Go to admin panel, enable the *Backoffice* extension.
2. Go to Backoffice, enable *Taxonomies* extension.
3. Click Taxonomies at the top of the Backoffice sidebar to configure.

If you install Flamarkt in the future, you might need to run `php flarum migrate` via SSH to finish the integration between the 2 extensions.

All types of taxonomies are currently shown on a single page without proper separation.
Dedicated pages will be introduced in a future release.

## Scout Integration

Taxonomies will automatically integrate with the [Scout extension](https://github.com/clarkwinkelmann/flarum-ext-scout) when both extensions are enabled.
Only version 0.3+ of Scout is supported. Using Taxonomies with an older version of Scout will result in errors.

With this integration, the taxonomy term names can become part of the discussion, user and product indexes.

This feature can be manually toggled for each individual taxonomy.
You must manually re-build the search index if you change the setting on an existing Taxonomy or if you delete a Taxonomy while terms are still attached to the resources.

Due to the way Scout is designed, the same search index is used for all users.
Once part of the index, any user with the permission to list the resource ("View forum" for discussions, "Search users" for users and everyone for products) will be able to use the terms in a search query even if they are not authorized to see the taxonomies.
You probably shouldn't enable this feature unless you are certain all your data for this resource type is public or that the whole forum is closed off to unauthorized users.

## Known issues

The backoffice for terms management is currently not paginated.
This can lead to backoffice performance issues with large numbers of terms, which is more likely to happen when custom values are allowed.

Changing the forum homepage can lead to issues.
Setting the homepage to user list or product list will likely lead to problems.
Setting the homepage to custom pages that aren't a searchable list of resources should be fine.

The list of available taxonomies and terms will be leaked by the REST API to any user allowed to use any of them.
This includes the user taxonomies even if the user is only allowed to edit discussion taxonomies and vice-versa.

Tag scoped discussion taxonomies and terms will also be visible via the REST API to every user, even if they cannot see the tag they are scoped to.
Changing the tags of an existing discussion with scoped taxonomies is not supported.
If you change the tags of a discussion, you might be unable to edit its taxonomies again.

Flamarkt Product support is still a work in progress.

## Support

This extension is actively supported.
Please use the Flarum Discuss discussion to discuss features and report issues.

Please only create GitHub issues for bugs with reliable reproduction steps.
