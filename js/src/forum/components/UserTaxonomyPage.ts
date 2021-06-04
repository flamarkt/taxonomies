import {Vnode} from 'mithril';
import UserPage from 'flarum/forum/components/UserPage';
import sortTaxonomies from '../../common/utils/sortTaxonomies';
import termsLabel from '../../common/helpers/termsLabel';
import Taxonomy from '../../common/models/Taxonomy';
import Term from '../../common/models/Term';

// @ts-ignore UserPage.view not type-hinted
export default class UserTaxonomyPage extends UserPage {
    oninit(vnode: Vnode<any, this>) {
        super.oninit(vnode);

        this.loadUser(m.route.param('username'));
    }

    content() {
        const terms: Term[] = this.user.taxonomyTerms();

        if (!terms || !terms.length) {
            return null;
        }

        const taxonomies: Taxonomy[] = [];

        terms.forEach(term => {
            const taxonomy = term.taxonomy();

            if (taxonomy && taxonomies.indexOf(taxonomy) === -1) {
                taxonomies.push(taxonomy);
            }
        });

        return sortTaxonomies(taxonomies).map(taxonomy => [
            m('h2', taxonomy.name()),
            termsLabel(terms.filter(term => term.taxonomy() === taxonomy), {userLink: true}),
        ]);
    }
}
