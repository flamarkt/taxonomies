import {Vnode} from 'mithril';
import app from 'flamarkt/backoffice/backoffice/app';
import Component, {ComponentAttrs} from 'flarum/common/Component';
import {ApiPayloadPlural} from 'flarum/common/Store';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Sortable from 'flamarkt/backoffice/common/components/Sortable';
import sortTerms from '../../common/utils/sortTerms';
import EditTermModal from './EditTermModal';
import taxonomyIcon from '../../common/helpers/taxonomyIcon';
import Term from '../../common/models/Term';
import Taxonomy from '../../common/models/Taxonomy';

interface TaxonomyTermsListAttrs extends ComponentAttrs {
    taxonomy: Taxonomy
}

export default class TaxonomyTermsList extends Component<TaxonomyTermsListAttrs> {
    terms: Term[] | null = null

    oninit(vnode: Vnode<TaxonomyTermsListAttrs, this>) {
        super.oninit(vnode);

        app.request<ApiPayloadPlural>({
            method: 'GET',
            url: app.forum.attribute('apiUrl') + this.attrs.taxonomy.apiTermsEndpoint(),
        }).then(result => {
            this.terms = app.store.pushPayload<Term[]>(result);
            m.redraw();
        });
    }

    view() {
        return m('.TaxonomyTermEdit', [
            this.terms === null ? LoadingIndicator.component({}) : this.viewTerms(this.terms),
        ]);
    }

    viewTerms(terms: Term[]) {
        return [
            m(Sortable, {
                containerTag: 'ol',
                className: 'TaxonomyTermList',
                handleClassName: null,
                onsort: (origin: number, destination: number) => {
                    terms.splice(destination, 0, ...terms.splice(origin, 1));

                    app.request<ApiPayloadPlural>({
                        method: 'POST',
                        url: app.forum.attribute('apiUrl') + this.attrs.taxonomy.apiOrderEndpoint(),
                        body: {
                            order: terms.map(term => term.id()),
                        },
                    }).then(result => {
                        // If there's no error, we save the new order so it can be used in case a redraw is triggered
                        app.store.pushPayload(result);
                    }).catch(e => {
                        // If there's an error, we force a full redraw to make sure the user sees what is saved
                        m.redraw();
                        throw e;
                    });
                },
            }, terms.map((term, index) => m('li.TaxonomyTermListItem', {
                draggable: true,
                key: term.id(),
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
                                terms.splice(index, 1);
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
                            this.terms = sortTerms([...terms, term]);
                        },
                    });
                },
            }, app.translator.trans('flamarkt-taxonomies.admin.page.create.term')),
            ' ',
            Button.component({
                className: 'Button',
                onclick: () => {
                    app.request<ApiPayloadPlural>({
                        method: 'POST',
                        url: app.forum.attribute('apiUrl') + this.attrs.taxonomy.apiOrderEndpoint(),
                        body: {
                            order: [],
                        },
                    }).then(result => {
                        this.terms = app.store.pushPayload<Term[]>(result);
                        m.redraw();
                    }).catch(e => {
                        m.redraw();
                        throw e;
                    });
                },
            }, app.translator.trans('flamarkt-taxonomies.admin.page.reset-term-order')),
        ];
    }
}
