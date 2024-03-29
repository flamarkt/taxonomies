import {Vnode} from 'mithril';
import Component, {ComponentAttrs} from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Dropdown from 'flarum/common/components/Dropdown';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Term from '../../common/models/Term';
import Taxonomy from '../../common/models/Taxonomy';
import retrieveTerms from '../../common/utils/retrieveTerms';

interface TaxonomyDropdownAttrs extends ComponentAttrs {
    taxonomy: Taxonomy
    onchange: (term: Term) => void
    activeTermSlug?: string
}

export default class TaxonomyDropdown extends Component<TaxonomyDropdownAttrs> {
    termsInitialized: boolean = false;
    terms: Term[] | null = null;

    oninit(vnode: Vnode<TaxonomyDropdownAttrs>) {
        super.oninit(vnode);

        // If a term is active while the component inits, we're probably loading a page with pre-loaded filters
        // We could retrieve the term from the store if it is present on discussion results
        // But it's unreliable since a page with no results wouldn't have it but we want to show the term in the dropdown
        if (this.attrs.activeTermSlug) {
            this.loadTerms();
        }
    }

    loadTerms() {
        if (this.termsInitialized) {
            return;
        }

        this.termsInitialized = true;


        retrieveTerms(this.attrs.taxonomy).then(terms => {
            this.terms = terms;
            m.redraw();
        });
    }

    view() {
        let activeTerm = this.terms && this.terms.find(t => t.slug() === this.attrs.activeTermSlug);

        return Dropdown.component({
            buttonClassName: 'Button',
            label: this.attrs.taxonomy.name() + (activeTerm ? ': ' + activeTerm.name() : ''),
            onshow: () => {
                this.loadTerms();
            },
        }, this.terms === null ? [
            LoadingIndicator.component(),
        ] : this.terms.map(term => {
            const active = this.attrs.activeTermSlug === term.slug();

            return Button.component({
                icon: active ? 'fas fa-check' : true,
                onclick: () => this.attrs.onchange(term),
                active, // Remove after https://github.com/flarum/core/issues/2265
            }, term.name());
        }) as any);
    }
}
