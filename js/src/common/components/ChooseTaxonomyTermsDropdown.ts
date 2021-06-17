import {Vnode, VnodeDOM} from 'mithril';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import icon from 'flarum/common/helpers/icon';
import ChooseTaxonomyTermsModal, {ChooseTaxonomyTermsModalAttrs} from './ChooseTaxonomyTermsModal';
import Term from '../models/Term';

export default class ChooseTaxonomyTermsDropdown extends ChooseTaxonomyTermsModal {
    lastSaveState: 'success' | 'error' | 'neutral' = 'neutral'
    dropdownIsFocused: boolean = false
    onmousedown!: (event: Event) => void

    oninit(vnode: Vnode<ChooseTaxonomyTermsModalAttrs, this>) {
        super.oninit(vnode);

        this.navigator.when(event => {
            // Same as the original when() in the modal
            // (we are replacing the original since we can have a single callback)
            if (event.key === ' ' && this.searchFilter === '') {
                event.preventDefault();
                this.select(event);

                return false;
            }

            // We don't want Tab to act as select, as this prevent moving from field to field
            return event.key !== 'Tab';
        });
    }

    oncreate(vnode: VnodeDOM<ChooseTaxonomyTermsModalAttrs, this>) {
        // Not calling super because it just tries to do modal stuff
        //super.oncreate(vnode);

        // Since we are not calling the original Component.oncreate, we need to copy the dom reference manually
        this.element = vnode.dom;

        this.onmousedown = (event: Event) => {
            const dropdown = vnode.dom.querySelector('.Dropdown-menu');

            if (
                dropdown &&
                dropdown.contains(event.target as HTMLElement)
            ) {
                if (!this.dropdownIsFocused) {
                    this.dropdownIsFocused = true;
                    m.redraw();
                }
            } else {
                if (this.dropdownIsFocused) {
                    this.dropdownIsFocused = false;
                    m.redraw();
                }
            }
        };

        document.addEventListener('mousedown', this.onmousedown);
    }

    onremove(vnode: VnodeDOM<ChooseTaxonomyTermsModalAttrs, this>) {
        super.onremove(vnode);

        document.removeEventListener('mousedown', this.onmousedown);
    }

    view() {
        const description = this.attrs.taxonomy.description();

        return m('.ChooseTaxonomyTermsDropdown', m('form', {
            // The form element is only there to prevent any unwanted page POST submission
            // It's also used so that onready() continues to focus the field when called
            // Due to the jQuery selector in onready, the form cannot be the root element of view()
            onsubmit(event: Event) {
                event.preventDefault();
            },
        }, [
            m('.ChooseTaxonomyTermsInput', [
                m('.ChooseTaxonomyTermsModal-form', this.formItems().toArray()),
                // .ChooseTaxonomyTermsModal-list must be kept because it's used by the javascript of the keyboard navigation
                this.listAvailableTerms(this.filteredAvailableTerms()),
            ]),
            description ? m('p', description) : null,
        ]));
    }

    formItems() {
        const items = super.formItems();

        items.remove('submit');

        let status = null;

        if (this.saving) {
            status = LoadingIndicator.component();
        } else if (this.lastSaveState === 'success') {
            status = icon('fas fa-check');
        } else if (this.lastSaveState === 'error') {
            status = icon('fas fa-times');
        }

        items.add('status', m('.ChooseTaxonomyTermsStatus', status));

        return items;
    }

    listAvailableTerms(terms: Term[]) {
        // We need two attributes to hold the dropdown open
        // One is the input focus, managed by the modal
        // The second one is needed because there's a short moment during a click where the focus is lost on the input
        // mousedown triggers first, then the input blur, and only in mouseup can we put focus on the input again
        if (!(this.inputIsFocused || this.dropdownIsFocused) || terms.length === 0) {
            return null;
        }

        let content;

        if (this.availableTerms === null) {
            content = LoadingIndicator.component();
        } else {
            content = terms.map(this.listAvailableTerm.bind(this));
        }

        return m('ul.Dropdown-menu.ChooseTaxonomyTermsModal-list', content);
    }

    listAvailableTerm(term: Term, index: number) {
        return m('li', super.listAvailableTerm(term, index));
    }

    toggleTerm(term: Term) {
        super.toggleTerm(term);

        // Auto-save
        this.lastSaveState = 'neutral';
        this.saveResource();
    }

    select(e: KeyboardEvent) {
        const $element = this.getDomElement(this.activeListIndex);

        // If nothing matches, the user probably typed text that doesn't match anything
        // In that case there's nothing to select
        // We reset the typed value to force the user to enter something else and/or correctly reflect what is saved
        if (!$element.length) {
            this.searchFilter = '';
            return;
        }

        // Same as original select(), but without the submission logic (because we auto-save)
        // This now allows using Enter to remove a highlighted item as well
        $element[0].dispatchEvent(new Event('click'));
    }

    onsaved() {
        this.lastSaveState = 'success';
        super.onsaved();
    }

    onerror() {
        this.lastSaveState = 'error';
        super.onerror();
    }
}
