import {Vnode} from 'mithril';
import app from 'flamarkt/backoffice/backoffice/app';
import {ComponentAttrs} from 'flarum/common/Component';
import {ApiPayloadPlural} from 'flarum/common/Store';
import Page from 'flarum/common/components/Page';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Sortable from 'flamarkt/backoffice/common/components/Sortable';
import extractText from 'flarum/common/utils/extractText';
import sortTaxonomies from '../../common/utils/sortTaxonomies';
import TaxonomyTermsList from './TaxonomyTermsList';
import EditTaxonomyModal from './EditTaxonomyModal';
import taxonomyIcon from '../../common/helpers/taxonomyIcon';
import Taxonomy from '../../common/models/Taxonomy';

export default class TaxonomiesPage extends Page {
    tabIndex: number = 0;
    taxonomies: Taxonomy[] | null = null;

    oninit(vnode: Vnode<ComponentAttrs, this>) {
        super.oninit(vnode);

        app.setTitle(extractText(app.translator.trans('flamarkt-taxonomies.admin.page.title')));

        app.request<ApiPayloadPlural>({
            method: 'GET',
            url: app.forum.attribute('apiUrl') + '/flamarkt/taxonomies',
            params: {
                filter: {
                    type: m.route.param('resource'),
                },
            },
        }).then(result => {
            this.taxonomies = app.store.pushPayload<Taxonomy[]>(result);
            m.redraw();
        });
    }

    view() {
        return m('.TaxonomiesPage', m('.container', [
            this.taxonomies === null ? LoadingIndicator.component({}) : this.viewTaxonomies(this.taxonomies),
        ]));
    }

    viewTaxonomies(taxonomies: Taxonomy[]) {
        return [
            m(Sortable, {
                className: 'TaxonomyTabs',
                direction: 'horizontal',
                handleClassName: null,
                onsort: (origin: number, destination: number) => {
                    taxonomies.splice(destination, 0, ...taxonomies.splice(origin, 1));

                    app.request<ApiPayloadPlural>({
                        method: 'POST',
                        url: app.forum.attribute('apiUrl') + '/flamarkt/taxonomies/order',
                        body: {
                            order: taxonomies.map(taxonomy => taxonomy.id()),
                            type: m.route.param('resource'),
                        },
                    }).then(result => {
                        this.taxonomies = app.store.pushPayload<Taxonomy[]>(result);
                        this.tabIndex = 0;
                    }).catch(e => {
                        m.redraw();
                        throw e;
                    });
                },
            }, [
                ...taxonomies.map((taxonomy, index) => m('.TaxonomyTab', {
                    draggable: true,
                    key: taxonomy.id(),
                    onclick: () => {
                        this.tabIndex = index;
                    },
                    className: this.tabIndex === index ? 'active' : '',
                    style: {
                        color: taxonomy.color(),
                    },
                }, [
                    taxonomyIcon(taxonomy),
                    ' ',
                    taxonomy.name(),
                    ' ',
                    Button.component({
                        className: 'Button Button--link',
                        icon: 'fas fa-pencil-alt',
                        onclick: () => {
                            app.modal.show(EditTaxonomyModal, {
                                taxonomy,
                                ondelete: () => {
                                    taxonomies.splice(index, 1);
                                    this.tabIndex = 0;
                                },
                            });
                        },
                    }),
                ])),
                Button.component({
                    key: 'new',
                    className: 'TaxonomyTab',
                    icon: 'fas fa-plus',
                    onclick: () => {
                        app.modal.show(EditTaxonomyModal, {
                            type: m.route.param('resource'),
                            onsave: (taxonomy: Taxonomy) => {
                                // If the user changed the type during creation, move to the page for that type
                                // We won't be able to focus the new taxonomy
                                if (taxonomy.type() !== m.route.param('resource')) {
                                    m.route.set(app.route('taxonomies', {
                                        resource: taxonomy.type(),
                                    }));
                                    return;
                                }

                                // If we are already on the correct page, focus the tab of the new taxonomy
                                this.taxonomies = sortTaxonomies([...taxonomies, taxonomy]);
                                this.tabIndex = this.taxonomies.findIndex(t => t === taxonomy);
                            },
                        });
                    },
                }, app.translator.trans('flamarkt-taxonomies.admin.page.create.taxonomy')),
            ]),
            // Nested DIVs to use key to force a redraw of the list
            this.tabIndex < taxonomies.length ? m('div', m('div', {
                key: taxonomies[this.tabIndex].id(),
            }, TaxonomyTermsList.component({
                taxonomy: taxonomies[this.tabIndex],
            }))) : null,
        ];
    }
}
