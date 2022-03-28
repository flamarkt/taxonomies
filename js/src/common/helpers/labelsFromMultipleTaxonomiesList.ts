import {Attributes} from 'mithril';
import sortTaxonomies from '../utils/sortTaxonomies';
import termsLabel from './termsLabel';
import Term from '../models/Term';
import Taxonomy from '../models/Taxonomy';

export default function (terms: Term[], attrs: Attributes = {}) {
    const taxonomies: Taxonomy[] = [];

    terms.forEach(term => {
        const taxonomy = term.taxonomy();

        if (taxonomy && taxonomies.indexOf(taxonomy) === -1) {
            taxonomies.push(taxonomy);
        }
    });

    return sortTaxonomies(taxonomies).map(taxonomy => {
        return termsLabel(terms.filter(term => term.taxonomy() === taxonomy), attrs);
    });
}
