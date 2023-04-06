import Product from 'flamarkt/core/common/models/Product';
import Component, {ComponentAttrs} from 'flarum/common/Component';
import sortTaxonomies from '../../common/utils/sortTaxonomies';
import termsLabel from '../../common/helpers/termsLabel';
import Taxonomy from '../../common/models/Taxonomy';
import Term from '../../common/models/Term';

export interface ProductTaxonomySectionAttrs extends ComponentAttrs {
    product: Product
    originalProduct: Product
}

export default class ProductTaxonomySection extends Component<ProductTaxonomySectionAttrs> {
    view() {
        const terms: Term[] = this.attrs.product.taxonomyTerms() || [];

        // If we are showing a product variant, merge the parent taxonomies with the child
        if (this.attrs.originalProduct !== this.attrs.product) {
            (this.attrs.originalProduct.taxonomyTerms() || []).forEach(term => {
                if (terms.indexOf(term) === -1) {
                    terms.push(term);
                }
            });
        }

        const taxonomies: Taxonomy[] = [];

        terms.forEach(term => {
            const taxonomy = term.taxonomy();

            if (taxonomy && taxonomies.indexOf(taxonomy) === -1) {
                taxonomies.push(taxonomy);
            }
        });

        return m('section.ProductShowSection.ProductShowSection--taxonomies', m('.ProductTaxonomies-list', sortTaxonomies(taxonomies).map(taxonomy => m('dl.ProductTaxonomies-taxonomy', [
            m('dt', taxonomy.name()),
            m('dd', termsLabel(terms.filter(term => term.taxonomy() === taxonomy), {productLink: true})),
        ]))));
    }
}
