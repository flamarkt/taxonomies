import app from 'flarum/forum/app';
import {extend} from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import DiscussionListState from 'flarum/forum/states/DiscussionListState';
import GlobalSearchState from 'flarum/forum/states/GlobalSearchState';
import sortTaxonomies from '../common/utils/sortTaxonomies';
import TaxonomyDropdown from './components/TaxonomyDropdown';
import Term from '../common/models/Term';
import showsFilterFor from './utils/showsFilterFor';

export default function () {
    extend(IndexPage.prototype, 'viewItems', function (items) {
        sortTaxonomies(app.store.all('flamarkt-taxonomies')).filter(showsFilterFor('discussions')).forEach(taxonomy => {
            // If the taxonomy is not scoped, or if it's scoped to more than 1 tag, show the filter all the time
            // Only filters for one specific tag will be hidden by default
            if (taxonomy.tagIds().length === 1 && ('flarum-tags' in flarum.extensions)) {
                const tag = this.currentTag();

                if (!tag) {
                    return;
                }

                if (taxonomy.tagIds().indexOf(tag.id()) === -1) {
                    const parent = tag.parent();

                    if (!parent) {
                        return;
                    }

                    if (taxonomy.tagIds().indexOf(parent.id()) === -1) {
                        return;
                    }
                }
            }

            items.add('taxonomy-' + taxonomy.slug(), TaxonomyDropdown.component({
                taxonomy,
                activeTermSlug: app.search.params()[taxonomy.slug()],
                onchange: (term: Term) => {
                    const params = app.search.params();

                    const currentFilterForTaxonomy = params[taxonomy.slug()];

                    if (term.slug() === currentFilterForTaxonomy) {
                        delete params[taxonomy.slug()];
                    } else {
                        params[taxonomy.slug()] = term.slug();
                    }

                    // @ts-ignore Flarum injects routeName as a page attr but this isn't type-hinted anywhere
                    const {routeName} = this.attrs;

                    m.route.set(app.route(routeName, params));
                },
            }));
        });
    });

    extend(GlobalSearchState.prototype, 'stickyParams', function (params) {
        sortTaxonomies(app.store.all('flamarkt-taxonomies')).filter(showsFilterFor('discussions')).forEach(taxonomy => {
            params[taxonomy.slug()] = m.route.param(taxonomy.slug());
        });
    });

    extend(DiscussionListState.prototype, 'requestParams', function (params: any) {
        // Include the taxonomies when navigating to the discussion list
        // Same includes are pre-loaded in DiscussionAttributes.php
        params.include.push('taxonomyTerms', 'taxonomyTerms.taxonomy');

        sortTaxonomies(app.store.all('flamarkt-taxonomies')).filter(showsFilterFor('discussions')).forEach(taxonomy => {
            const filterTermSlug = this.params[taxonomy.slug()];

            if (filterTermSlug) {
                if (params.filter.q) {
                    params.filter.q = (params.filter.q || '') + ' taxonomy:' + taxonomy.slug() + ':' + filterTermSlug;
                } else {
                    params.filter.taxonomy = (params.filter.taxonomy || {});
                    params.filter.taxonomy[taxonomy.slug()] = filterTermSlug;
                }
            }
        });
    });
}
