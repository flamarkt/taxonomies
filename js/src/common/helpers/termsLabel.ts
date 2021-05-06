import extract from 'flarum/common/utils/extract';
import termLabel from './termLabel';
import sortTerms from '../utils/sortTerms';
import Term from '../models/Term';
import {Attributes, Vnode} from 'mithril';

export default function tagsLabel(terms: Term[], attrs: Attributes = {}) {
    const children: Vnode[] = [];
    const discussionLink = extract(attrs, 'discussionLink');
    const userLink = extract(attrs, 'userLink');

    attrs.className = 'TaxonomiesLabel ' + (attrs.className || '');

    if (terms) {
        let taxonomy = extract(attrs, 'taxonomy');

        if (!taxonomy) {
            taxonomy = terms[0].taxonomy();
        }

        if (taxonomy) {
            attrs['data-slug'] = taxonomy.slug();

            if (taxonomy.showLabel()) {
                children.push(termLabel(taxonomy, {
                    className: 'TaxonomyParentLabel',
                }));
            }
        }

        sortTerms(terms).forEach(tag => {
            if (tag || terms.length === 1) {
                children.push(termLabel(tag, {discussionLink, userLink}));
            }
        });
    } else {
        children.push(termLabel());
    }

    return m('span', attrs, children);
}
