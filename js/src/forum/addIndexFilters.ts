import {extend} from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import DiscussionListState from 'flarum/forum/states/DiscussionListState';
import GlobalSearchState from 'flarum/forum/states/GlobalSearchState';
import ItemList from 'flarum/common/utils/ItemList';
import sortTaxonomies from '../common/utils/sortTaxonomies';
import TaxonomyDropdown from './components/TaxonomyDropdown';
import Term from '../common/models/Term';

export default function () {
    extend(IndexPage.prototype, 'viewItems', function (this: IndexPage, items: ItemList) {
        sortTaxonomies(app.store.all('flamarkt-taxonomies')).forEach(taxonomy => {
            if (!taxonomy.canSearchDiscussions() || !taxonomy.showFilter()) {
                return;
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

                    m.route.set(app.route(this.attrs.routeName, params));
                },
            }));
        });
    });

    extend(GlobalSearchState.prototype, 'stickyParams', function (params: any) {
        sortTaxonomies(app.store.all('flamarkt-taxonomies')).filter(t => t.canSearchDiscussions() && t.showFilter()).forEach(taxonomy => {
            params[taxonomy.slug()] = m.route.param(taxonomy.slug());
        });
    });

    extend(DiscussionListState.prototype, 'requestParams', function (this: DiscussionListState, params: any) {
        // Include the taxonomies when navigating to the discussion list
        // Same includes are pre-loaded in DiscussionAttributes.php
        params.include.push('taxonomyTerms', 'taxonomyTerms.taxonomy');

        sortTaxonomies(app.store.all('flamarkt-taxonomies')).filter(t => t.canSearchDiscussions() && t.showFilter()).forEach(taxonomy => {
            const filterTermSlug = this.params[taxonomy.slug()];

            if (filterTermSlug) {
                params.filter.q = (params.filter.q || '') + ' taxonomy:' + taxonomy.slug() + ':' + filterTermSlug;

                //TODO: switch between gambits and filters
                //params.filter[taxonomy.slug()] = filterTermSlug;
            }
        });
    });
}
