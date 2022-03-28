import app from 'flarum/forum/app';
import {extend} from 'flarum/common/extend';
import ProductIndexLayout from 'flamarkt/core/forum/layouts/ProductIndexLayout';
import ProductIndexPage from 'flamarkt/core/forum/pages/ProductIndexPage';
import sortTaxonomies from '../common/utils/sortTaxonomies';
import TaxonomyDropdown from './components/TaxonomyDropdown';
import Term from '../common/models/Term';
import showsFilterFor from './utils/showsFilterFor';

export default function () {
    if (!ProductIndexLayout || !ProductIndexPage) {
        return;
    }

    extend(ProductIndexLayout.prototype, 'filters', function (items) {
        sortTaxonomies(app.store.all('flamarkt-taxonomies')).filter(showsFilterFor('products')).forEach(taxonomy => {
            items.add('taxonomy-' + taxonomy.slug(), TaxonomyDropdown.component({
                taxonomy,
                activeTermSlug: m.route.param()[taxonomy.slug()],
                onchange: (term: Term) => {
                    const params = {...m.route.param()};

                    delete params.key;

                    const currentFilterForTaxonomy = params[taxonomy.slug()];

                    if (term.slug() === currentFilterForTaxonomy) {
                        delete params[taxonomy.slug()];
                    } else {
                        params[taxonomy.slug()] = term.slug();
                    }

                    // @ts-ignore
                    const {routeName} = app.current.data;

                    //TODO: also apply to the filters. Right now it's just the URL that changes
                    m.route.set(app.route(routeName, params));
                },
            }));
        });
    });

    extend(ProductIndexPage.prototype, 'initState', function (state) {
        const params = m.route.param();

        sortTaxonomies(app.store.all('flamarkt-taxonomies')).filter(showsFilterFor('products')).forEach(taxonomy => {
            const filterTermSlug = params[taxonomy.slug()];

            if (filterTermSlug) {
                // Same implementation as addIndexFilters()
                state.params.q = (state.params.q || '') + ' taxonomy:' + taxonomy.slug() + ':' + filterTermSlug;
            }
        });
    });
}
