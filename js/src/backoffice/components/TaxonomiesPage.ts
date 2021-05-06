import sortable from 'html5sortable/dist/html5sortable.es.js';

import Page from 'flarum/common/components/Page';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import sortTaxonomies from '../../common/utils/sortTaxonomies';
import TaxonomyTermsList from './TaxonomyTermsList';
import EditTaxonomyModal from './EditTaxonomyModal';
import taxonomyIcon from '../../common/helpers/taxonomyIcon';
import Taxonomy from "../../common/models/Taxonomy";

export default class TaxonomiesPage extends Page {
    tabIndex: number = 0;
    taxonomies: Taxonomy[] | null = null;

    oninit(vnode) {
        super.oninit(vnode);

        app.request({
            method: 'GET',
            url: app.forum.attribute('apiUrl') + '/flamarkt/taxonomies',
        }).then(result => {
            this.taxonomies = app.store.pushPayload(result);
            m.redraw();
        });
    }

    view() {
        return m('.TaxonomiesPage', m('.container', [
            this.taxonomies === null ? LoadingIndicator.component({}) : [
                m('h2', app.translator.trans('flamarkt-taxonomies.admin.page.title')),
                m('.TaxonomyTabs', {
                    config: element => {
                        sortable(element, {
                            selector: '.js-sort-taxonomy-item',
                        })[0].addEventListener('sortupdate', event => {
                            const order = this.$('.js-sort-taxonomy-item')
                                .map(function () {
                                    return $(this).data('id');
                                })
                                .get();

                            app.request({
                                method: 'POST',
                                url: app.forum.attribute('apiUrl') + '/flamarkt/taxonomies/order',
                                data: {
                                    order,
                                },
                            }).then(result => {
                                this.taxonomies = app.store.pushPayload(result);
                                this.tabIndex = 0;
                            }).catch(e => {
                                m.redraw();
                                throw e;
                            });
                        });
                    },
                }, [
                    ...this.taxonomies.map((taxonomy, index) => m('.TaxonomyTab.js-sort-taxonomy-item', {
                        'data-id': taxonomy.id(),
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
                                        this.taxonomies.splice(index, 1);
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
                                onsave: taxonomy => {
                                    this.taxonomies = sortTaxonomies([...this.taxonomies, taxonomy]);
                                    this.tabIndex = this.taxonomies.findIndex(t => t === taxonomy);
                                },
                            });
                        },
                    }, app.translator.trans('flamarkt-taxonomies.admin.page.create.taxonomy')),
                ]),
                // Nested DIVs to use key to force a redraw of the list
                this.tabIndex < this.taxonomies.length ? m('div', m('div', {
                    key: this.taxonomies[this.tabIndex].id(),
                }, TaxonomyTermsList.component({
                    taxonomy: this.taxonomies[this.tabIndex],
                }))) : null,
            ],
        ]));
    }
}
