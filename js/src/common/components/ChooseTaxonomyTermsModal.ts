import {Vnode} from 'mithril';
import {ComponentAttrs} from 'flarum/common/Component';
import Modal from 'flarum/common/components/Modal';
import Model from 'flarum/common/Model';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import highlight from 'flarum/common/helpers/highlight';
import classList from 'flarum/common/utils/classList';
import ItemList from 'flarum/common/utils/ItemList';
import extractText from 'flarum/common/utils/extractText';
import KeyboardNavigatable from 'flarum/forum/utils/KeyboardNavigatable';

import termLabel from '../helpers/termLabel';
import taxonomyIcon from '../helpers/taxonomyIcon';
import termToIdentifier from '../utils/termToIdentifier';
import Term from '../models/Term';
import Taxonomy from '../models/Taxonomy';

/**
 * Comparing objects directly is unreliable because we will be creating some new records as well
 * So we use this method to do a proper deep check
 */
function isSameTerm(a: Term, b: Term) {
    if (a.data.type !== b.data.type) {
        return false;
    }

    // If both have an ID and it's different
    if (a.id() && b.id()) {
        return a.id() === b.id();
    }

    // If only one has an ID, it's different
    if (!a.id() !== !b.id()) {
        return false;
    }

    // If both don't have an ID, it's a new value and we compare the name
    return a.name() === b.name();
}

interface ChooseTaxonomyTermsModalAttrs extends ComponentAttrs {
    resource: Model
    taxonomy: Taxonomy
    selectedTerms: Term[]
    onsubmit?: (terms: Term[]) => void
}

/**
 * Based on Flarum's TagDiscussionModal
 */
export default class ChooseTaxonomyTermsModal extends Modal {
    availableTerms: Term[] | null = null;
    selectedTerms: Term[] = [];
    searchFilter: string = '';
    activeListIndex: number = 0;
    inputIsFocused: boolean = false;
    saving: boolean = false;
    navigator!: KeyboardNavigatable;

    attrs!: ChooseTaxonomyTermsModalAttrs

    oninit(vnode: Vnode<ChooseTaxonomyTermsModalAttrs, this>) {
        super.oninit(vnode);

        if (this.attrs.selectedTerms) {
            this.attrs.selectedTerms.forEach(this.addTerm.bind(this));
        } else if (this.attrs.resource) {
            console.log(this.attrs.resource.taxonomyTerms());
            this.attrs.resource.taxonomyTerms().forEach((term: Term) => {
                if (term.taxonomy().id() === this.attrs.taxonomy.id()) {
                    this.addTerm(term);
                }
            });
        }

        app.request({
            method: 'GET',
            url: app.forum.attribute('apiUrl') + this.attrs.taxonomy.apiEndpoint() + '/terms',
        }).then(result => {
            this.availableTerms = app.store.pushPayload(result);

            m.redraw();
        });

        this.navigator = new KeyboardNavigatable();
        this.navigator
            .onUp(() => this.setIndex(this.activeListIndex - 1, true))
            .onDown(() => this.setIndex(this.activeListIndex + 1, true))
            .onSelect(this.select.bind(this))
            .onRemove(() => {
                if (!this.selectedTerms.length) {
                    return;
                }

                this.toggleTerm(this.selectedTerms[this.selectedTerms.length - 1]);
            })
            .when(event => {
                // We want to allow selecting with space because it's a common way to select
                // However this interferes with the ability to enter spaces
                // So we will have space act as select, but only if nothing is typed yet
                if (event.key === ' ' && this.searchFilter === '') {
                    event.preventDefault();
                    this.select(event);

                    return false;
                }

                return true;
            });
    }

    indexInSelectedTerms(term: Term) {
        return this.selectedTerms.findIndex(t => isSameTerm(t, term));
    }

    addTerm(term: Term) {
        this.selectedTerms.push(term);
    }

    removeTerm(term: Term) {
        const index = this.indexInSelectedTerms(term);

        if (index !== -1) {
            this.selectedTerms.splice(index, 1);
        }
    }

    className() {
        return 'ChooseTaxonomyTermsModal';
    }

    title() {
        return this.attrs.resource
            ? app.translator.trans('flamarkt-taxonomies.forum.modal.title.edit', {
                taxonomy: this.attrs.taxonomy.name(),
                title: m('em', this.attrs.resource.title ? this.attrs.resource.title() : this.attrs.resource.displayName()),
            })
            : app.translator.trans('flamarkt-taxonomies.forum.modal.title.new', {
                taxonomy: this.attrs.taxonomy.name(),
            });
    }

    getInstruction() {
        const count = this.selectedTerms.length;

        if (this.attrs.taxonomy.minTerms() && count < this.attrs.taxonomy.minTerms()) {
            const remaining = this.attrs.taxonomy.minTerms() - count;
            return app.translator.trans('flamarkt-taxonomies.forum.modal.placeholder', {
                count: remaining,
            });
        } else if (count === 0) {
            return app.translator.trans('flamarkt-taxonomies.forum.modal.placeholderOptional');
        }

        return '';
    }

    filteredAvailableTerms() {
        let availableTerms = this.availableTerms === null ? [] : this.availableTerms;
        const filter = this.searchFilter.toLowerCase();

        if (filter) {
            availableTerms = availableTerms.filter(term => term.name().substr(0, filter.length).toLowerCase() === filter);

            if (
                this.attrs.taxonomy.allowCustomValues() &&
                !availableTerms.some(term => term.name().toLowerCase() === filter)
            ) {
                const validation = this.attrs.taxonomy.customValueValidation();
                let regex: RegExp | null = null;

                if (validation === 'alpha_num') {
                    regex = /^[a-z0-9]$/i;
                } else if (validation === 'alpha_dash') {
                    regex = /^[a-z0-9_-]$/i;
                } else if (validation.indexOf('/') === 0) {
                    const parts = validation.split('/');
                    if (parts.length === 3) {
                        regex = new RegExp(parts[1], parts[2]);
                    }
                }

                if (!regex || regex.test(this.searchFilter)) {
                    availableTerms.push(app.store.createRecord('flamarkt-taxonomy-terms', {
                        attributes: {
                            name: this.searchFilter,
                        },
                    }));
                }
            }
        }

        if (this.attrs.taxonomy.maxTerms() && this.selectedTerms.length >= this.attrs.taxonomy.maxTerms()) {
            availableTerms = [];
        }

        return availableTerms;
    }

    content() {
        return [
            this.viewForm(),
            this.listAvailableTerms(this.filteredAvailableTerms()),
        ];
    }

    viewForm() {
        const description = this.attrs.taxonomy.description();

        return m('.Modal-body', [
            description ? m('p', description) : null,
            m('.ChooseTaxonomyTermsModal-form', this.formItems().toArray()),
        ]);
    }

    formItems() {
        const items = new ItemList();

        items.add('input', m('.ChooseTaxonomyTermsModal-form-input', m('.TermsInput.FormControl', {
            className: this.inputIsFocused ? 'focus' : '',
        }, this.inputItems().toArray())), 20);

        items.add('submit', m('.ChooseTaxonomyTermsModal-form-submit.App-primaryControl', Button.component({
            type: 'submit',
            className: 'Button Button--primary',
            disabled: this.attrs.taxonomy.minTerms() && this.selectedTerms.length < this.attrs.taxonomy.minTerms(),
            icon: 'fas fa-check',
            loading: this.saving,
        }, app.translator.trans('flamarkt-taxonomies.forum.modal.submit'))), 10);

        return items;
    }

    inputItems() {
        const items = new ItemList();

        items.add('selected', this.selectedTerms.map(term => {
            return m('span.TermsInput-term', {
                onclick: () => {
                    this.toggleTerm(term);
                    this.onready();
                },
            }, termLabel(term));
        }), 20);

        items.add('control', m('input.FormControl', {
            placeholder: extractText(this.getInstruction()),
            value: this.searchFilter,
            oninput: event => {
                this.searchFilter = event.target.value;
                this.activeListIndex = 0;
            },
            onkeydown: this.navigator.navigate.bind(this.navigator),
            // Use local methods so that other extensions can extend behaviour
            onfocus: this.oninputfocus.bind(this),
            onblur: this.oninputblur.bind(this),
        }), 10);

        return items;
    }

    oninputfocus() {
        this.inputIsFocused = true;
    }

    oninputblur() {
        this.inputIsFocused = false;
    }

    listAvailableTerms(terms: Term[]) {
        return m('.Modal-footer', this.availableTerms === null ?
            LoadingIndicator.component() :
            m('ul.ChooseTaxonomyTermsModal-list.SelectTermList', {
                className: terms.some(term => term.description()) ? 'SelectTermList--with-descriptions' : '',
            }, terms.map(this.listAvailableTerm.bind(this)))
        );
    }

    listAvailableTerm(term: Term, index: number) {
        return m('li.SelectTermListItem', {
            'data-index': index,
            className: classList({
                colored: !!term.color(),
                selected: this.indexInSelectedTerms(term) !== -1,
                active: this.activeListIndex === index,
            }),
            style: {color: term.color()},
            onmouseover: () => this.activeListIndex = index,
            onclick: this.toggleTerm.bind(this, term),
        }, [
            taxonomyIcon(term),
            m('span.SelectTermListItem-name', term.exists ? highlight(term.name(), this.searchFilter) : app.translator.trans('flamarkt-taxonomies.forum.modal.custom', {
                value: m('em', term.name()),
            })),
            term.description() ? m('span.SelectTermListItem-description', term.description()) : '',
        ]);
    }

    toggleTerm(term: Term) {
        const index = this.indexInSelectedTerms(term);

        if (index !== -1) {
            this.removeTerm(term);
        } else {
            this.addTerm(term);
        }

        if (this.searchFilter) {
            this.searchFilter = '';
            this.activeListIndex = 0;
        }

        // Defer re-focusing to next browser draw
        setTimeout(() => {
            this.onready();
        });
    }

    select(e) {
        const $element = this.getDomElement(this.activeListIndex);

        // If nothing matches, the user probably typed text that doesn't match anything
        // In that case we don't want to submit just yet, but we will delete the text
        // so that typing enter multiple times does end up submitting
        if (!$element.length) {
            this.searchFilter = '';
            return;
        }

        // Ctrl + Enter submits the selection, just Enter completes the current entry
        if (e.metaKey || e.ctrlKey || $element.is('.selected')) {
            if (this.selectedTerms.length) {
                this.$('form').submit();
            }
        } else {
            $element[0].dispatchEvent(new Event('click'));
        }
    }

    getDomElement(index: number) {
        return this.$(`.SelectTermListItem[data-index="${index}"]`);
    }

    setIndex(index: number, scrollToItem: boolean) {
        const $dropdown = this.$('.ChooseTaxonomyTermsModal-list');

        const indexLength = this.$('.SelectTermListItem').length;

        if (index < 0) {
            index = indexLength - 1;
        } else if (index >= indexLength) {
            index = 0;
        }

        const $item = this.getDomElement(index);
        this.activeListIndex = index;

        m.redraw();

        if (scrollToItem) {
            const dropdownScroll = $dropdown.scrollTop() || 0;
            const dropdownTop = $dropdown.offset()?.top || 0;
            const dropdownBottom = dropdownTop + ($dropdown.outerHeight() || 0);
            const itemTop = $item.offset()?.top || 0;
            const itemBottom = itemTop + ($item.outerHeight() || 0);

            let scrollTop;
            if (itemTop < dropdownTop) {
                scrollTop = dropdownScroll - dropdownTop + itemTop - parseInt($dropdown.css('padding-top'), 10);
            } else if (itemBottom > dropdownBottom) {
                scrollTop = dropdownScroll - dropdownBottom + itemBottom + parseInt($dropdown.css('padding-bottom'), 10);
            }

            if (typeof scrollTop !== 'undefined') {
                $dropdown.stop(true).animate({scrollTop}, 100);
            }
        }
    }

    onsubmit(event: Event) {
        event.preventDefault();

        if (this.attrs.resource) {
            this.saveResource();

            // Do not run the normal code - it might close the modal even if an error occurred
            return;
        }

        if (this.attrs.onsubmit) this.attrs.onsubmit(this.selectedTerms);

        app.modal.close();
    }

    saveResource() {
        this.saving = true;

        this.attrs.resource.save({
            relationships: {
                taxonomies: [
                    {
                        verbatim: true, // Flarum workaround, defined in flamarkt/core
                        type: 'flamarkt-taxonomies',
                        id: this.attrs.taxonomy.id(),
                        relationships: {
                            terms: {
                                data: this.selectedTerms.map(termToIdentifier),
                            },
                        },
                    },
                ],
            },
        }).then(this.onsaved.bind(this), this.onerror.bind(this));
    }

    onsaved() {
        if (app.current.matches(DiscussionPage)) {
            app.current.get('stream').update();
        }
        this.saving = false;
        m.redraw();

        app.modal.close();
    }

    onerror() {
        this.saving = false;
        m.redraw();
    }
}
