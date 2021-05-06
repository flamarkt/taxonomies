import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Dropdown from 'flarum/common/components/Dropdown';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Term from '../../common/models/Term';

/* global m */

export default class TaxonomyDropdown extends Component {
    termsInitialized: boolean = false;
    terms: Term[] | null = null;

    oninit(vnode) {
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

        app.request({
            method: 'GET',
            url: app.forum.attribute('apiUrl') + this.attrs.taxonomy.apiEndpoint() + '/terms',
        }).then(result => {
            this.terms = app.store.pushPayload(result);

            this.terms.forEach(term => {
                term.pushData({
                    relationships: {
                        taxonomy: this.attrs.taxonomy,
                    },
                });
            });

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
        }));
    }
}
