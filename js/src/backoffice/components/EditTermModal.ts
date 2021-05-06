import extractText from 'flarum/common/utils/extractText';
import {slug} from 'flarum/common/utils/string';
import AbstractEditModal from './AbstractEditModal';
import {ComponentAttrs} from "flarum/common/Component";
import Term from "../../common/models/Term";

interface EditTermModalAttrs extends ComponentAttrs {
    term: Term
}

export default class EditTermModal extends AbstractEditModal {
    name!: string
    slug!: string
    description!: string
    color!: string
    icon!: string

    oninit(vnode) {
        super.oninit(vnode);

        const {term} = this.attrs as EditTermModalAttrs;

        this.name = term ? term.name() : '';
        this.slug = term ? term.slug() : '';
        this.description = term ? term.description() : '';
        this.color = term ? term.color() : '';
        this.icon = term ? term.icon() : '';
    }

    translationPrefix() {
        return 'flamarkt-taxonomies.admin.edit-term.';
    }

    isNew() {
        return !this.attrs.term;
    }

    form() {
        return [
            m('.Form-group', [
                m('label', app.translator.trans(this.translationPrefix() + 'field.name')),
                m('input.FormControl', {
                    type: 'text',
                    value: this.name,
                    oninput: event => {
                        this.name = event.target.value;
                        this.slug = slug(event.target.value);
                        this.dirty = true;
                    },
                }),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans(this.translationPrefix() + 'field.slug')),
                m('input.FormControl', {
                    type: 'text',
                    value: this.slug,
                    oninput: event => {
                        this.slug = event.target.value;
                        this.dirty = true;
                    },
                }),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans(this.translationPrefix() + 'field.description')),
                m('textarea.FormControl', {
                    value: this.description,
                    oninput: event => {
                        this.description = event.target.value;
                        this.dirty = true;
                    },
                }),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans(this.translationPrefix() + 'field.color')),
                m('input.FormControl', {
                    type: 'text',
                    value: this.color,
                    oninput: event => {
                        this.color = event.target.value;
                        this.dirty = true;
                    },
                }),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans(this.translationPrefix() + 'field.icon')),
                m('.helpText', app.translator.trans(this.translationPrefix() + 'field.iconDescription', {
                    a: m('a', {
                        href: 'https://fontawesome.com/icons?m=free',
                        tabindex: -1,
                    }),
                })),
                m('input.FormControl', {
                    type: 'text',
                    value: this.icon,
                    oninput: event => {
                        this.icon = event.target.value;
                        this.dirty = true;
                    },
                }),
            ]),
        ];
    }

    ondelete() {
        if (!confirm(extractText(app.translator.trans(this.translationPrefix() + 'deleteConfirmation', {
            name: this.attrs.term.name(),
        })))) {
            return;
        }

        this.loading = true;

        this.attrs.term.delete({
            errorHandler: this.onerror.bind(this),
        }).then(() => {
            app.modal.close();

            if (this.attrs.ondelete) {
                this.attrs.ondelete();
            }
        }, () => {
            this.loaded();
        });
    }

    onsubmit(event) {
        event.preventDefault();

        this.loading = true;

        const record: Term = this.attrs.term || app.store.createRecord('flamarkt-taxonomy-terms');

        const options: any = {
            errorHandler: this.onerror.bind(this),
        };

        if (this.isNew()) {
            options.url = app.forum.attribute('apiUrl') + this.attrs.taxonomy.apiEndpoint() + '/terms';
        }

        record.save({
            name: this.name,
            slug: this.slug,
            description: this.description,
            color: this.color,
            icon: this.icon,
        }, options).then(() => {
            app.modal.close();

            if (this.attrs.onsave) {
                this.attrs.onsave(record);
            }
        }, () => {
            this.loaded();
        });
    }
}
