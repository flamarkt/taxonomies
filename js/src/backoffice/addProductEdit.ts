import app from 'flamarkt/backoffice/backoffice/app';
import ProductShowPage from 'flamarkt/core/backoffice/pages/ProductShowPage';
import {extend} from 'flarum/common/extend';
import sortTaxonomies from '../common/utils/sortTaxonomies';
import ChooseTaxonomyTermsDropdown from '../common/components/ChooseTaxonomyTermsDropdown';

export default function () {
    if (!ProductShowPage) {
        return;
    }

    extend(ProductShowPage.prototype, 'fields', function (items) {
        if (!this.product!.exists || !this.product!.attribute('canEditTaxonomies')) {
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
