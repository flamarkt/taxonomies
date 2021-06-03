import sortable from 'html5sortable/dist/html5sortable.es.js';

import {Vnode} from 'mithril';
import Component, {ComponentAttrs} from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import sortTerms from '../../common/utils/sortTerms';
import EditTermModal from './EditTermModal';
import taxonomyIcon from '../../common/helpers/taxonomyIcon';
import Term from "../../common/models/Term";
import Taxonomy from "../../common/models/Taxonomy";

interface TaxonomyTermsListAttrs extends ComponentAttrs {
    taxonomy: Taxonomy
}

export default class TaxonomyTermsList extends Component<TaxonomyTermsListAttrs> {
    terms: Term[] | null = null

    oninit(vnode: Vnode<TaxonomyTermsListAttrs, this>) {
        super.oninit(vnode);

        app.request({
            method: 'GET',
            url: app.forum.attribute('apiUrl') + this.attrs.taxonomy.apiEndpoint() + '/terms',
        }).then(result => {
            this.terms = app.store.pushPayload(result);
            m.redraw();
        });
    }

    view() {
        return m('.TaxonomyTermEdit', [
            this.terms === null ? LoadingIndicator.component({}) : m('ol.TaxonomyTermList', {
                //TODO: update for Mithril v2
                config: element => {
                    sortable(element)[0].addEventListener('sortupdate', event => {
                        const order = this.$('.js-sort-term-item')
                            .map(function () {
                                return $(this).data('id');
                            })
                            .get();

                        app.request({
                            method: 'POST',
                            url: app.forum.attribute('apiUrl') + this.attrs.taxonomy.apiEndpoint() + '/terms/order',
                            data: {
                                order,
                            },
                        }).then(result => {
                            // If there's no error, we save the new order so it can be used in case a redraw is triggered
                            app.store.pushPayload(result);
                        }).catch(e => {
                            // If there's an error, we force a full redraw to make sure the user sees what is saved
                            m.redraw();
                            throw e;
                        });
                    });
                },
            }, this.terms.map((term, index) => m('li.TaxonomyTermListItem.js-sort-term-item', {
                'data-id': term.id(),
                style: {
                    color: term.color(),
                },
            }, [
                taxonomyIcon(term),
                m('span.TaxonomyTermListItem-name', term.name()),
                Button.component({
                    className: 'Button Button--link',
                    icon: 'fas fa-pencil-alt',
                    onclick: () => {
                        app.modal.show(EditTermModal, {
                            term,
                            ondelete: () => {
                                this.terms.splice(index, 1);
                            },
                        });
                    },
                }),
            ]))),
            Button.component({
                className: 'Button',
                onclick: () => {
                    app.modal.show(EditTermModal, {
                        taxonomy: this.attrs.taxonomy,
                        onsave: (term: Term) => {
                            this.terms = sortTerms([...this.terms, term]);
                        },
                    });
                },
            }, app.translator.trans('flamarkt-taxonomies.admin.page.create.term')),
            ' ',
            Button.component({
                className: 'Button',
                onclick: () => {
                    app.request({
                        method: 'POST',
                        url: app.forum.attribute('apiUrl') + this.attrs.taxonomy.apiEndpoint() + '/terms/order',
                        data: {
                            order: [],
                        },
                    }).then(result => {
                        app.store.pushPayload(result);
                    }).catch(e => {
                        m.redraw();
                        throw e;
                    });
                },
            }, app.translator.trans('flamarkt-taxonomies.admin.page.reset-term-order')),
        ]);
    }
}
