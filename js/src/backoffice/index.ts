import app from 'flamarkt/backoffice/backoffice/app';
import BackofficeNav from 'flamarkt/backoffice/backoffice/components/BackofficeNav';
import ProductShowPage from 'flamarkt/core/backoffice/pages/ProductShowPage';
import {extend} from 'flarum/common/extend';
import LinkButton from 'flarum/common/components/LinkButton';
import TaxonomiesPage from './components/TaxonomiesPage';
import addModels from '../common/addModels';
import sortTaxonomies from '../common/utils/sortTaxonomies';
import ChooseTaxonomyTermsDropdown from '../common/components/ChooseTaxonomyTermsDropdown';

app.initializers.add('flamarkt-taxonomies', () => {
    addModels();

    app.routes.taxonomies = {
        path: '/taxonomies',
        component: TaxonomiesPage,
    };

    extend(BackofficeNav.prototype, 'items', function (items) {
        items.add('taxonomies', LinkButton.component({
            href: app.route('taxonomies'),
            icon: 'fas fa-tags',
        }, app.translator.trans('flamarkt-taxonomies.admin.menu.title')));
    });

    if (ProductShowPage) {
        extend(ProductShowPage.prototype, 'fields', function (items) {
            if (!this.product.exists || !this.product.attribute('canEditTaxonomies')) {
                return;
            }

            sortTaxonomies(app.forum.taxonomies()).forEach(taxonomy => {
                if (taxonomy.type() !== 'products') {
                    return;
                }

                items.add('taxonomy-' + taxonomy.slug(), m('.Form-group', [
                    m('label', taxonomy.name()),
                    m(ChooseTaxonomyTermsDropdown, {
                        resource: this.product,
                        taxonomy,
                    }),
                ]), -100);
            });
        });
    }
});
