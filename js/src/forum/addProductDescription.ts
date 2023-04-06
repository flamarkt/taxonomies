import {extend} from 'flarum/common/extend';
import ProductShowLayout from 'flamarkt/core/forum/layouts/ProductShowLayout';
import ProductTaxonomySection from './components/ProductTaxonomySection';

export default function () {
    if (!ProductShowLayout) {
        return;
    }

    extend(ProductShowLayout.prototype, 'sections', function (sections, product) {
        // Check both current product and original product for compatibility with Variants
        if ((product.taxonomyTerms() || []).length < 1 && (this.attrs.product!.taxonomyTerms() || []).length < 1) {
            return;
        }

        sections.add('taxonomies', ProductTaxonomySection.component({
            product,
            originalProduct: this.attrs.product,
        }));
    });
}
