import {extend} from 'flarum/common/extend';
import ProductIndexLayout from 'flamarkt/core/forum/layouts/ProductIndexLayout';
import ItemList from 'flarum/common/utils/ItemList';
import sortTaxonomies from '../common/utils/sortTaxonomies';
import TaxonomyDropdown from './components/TaxonomyDropdown';
import Term from '../common/models/Term';
import showsFilterFor from './utils/showsFilterFor';

export default function () {
    extend(ProductIndexLayout.prototype, 'filters', function (this: ProductIndexLayout, items: ItemList) {
        sortTaxonomies(app.store.all('flamarkt-taxonomies')).filter(showsFilterFor('products')).forEach(taxonomy => {
            items.add('taxonomy-' + taxonomy.slug(), TaxonomyDropdown.component({
                taxonomy,
                activeTermSlug: m.route.param()[taxonomy.slug()],
                onchange: (term: Term) => {
                    const params = m.route.param();

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
}
