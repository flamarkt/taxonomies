import {Vnode} from 'mithril';
import extractText from 'flarum/common/utils/extractText';
import {slug} from 'flarum/common/utils/string';
import withAttr from 'flarum/common/utils/withAttr';
import AbstractEditModal from './AbstractEditModal';
import {ComponentAttrs} from 'flarum/common/Component';
import Term from '../../common/models/Term';
import Taxonomy from '../../common/models/Taxonomy';

interface EditTermModalAttrs extends ComponentAttrs {
    term: Term
    taxonomy: Taxonomy
    onsave?: (term: Term) => void
    ondelete?: () => void
}

// @ts-ignore Modal.view not type-hinted
export default class EditTermModal extends AbstractEditModal {
    name!: string
    slug!: string
    description!: string
    color!: string
    icon!: string

    attrs!: EditTermModalAttrs

    oninit(vnode: Vnode<EditTermModalAttrs, this>) {
        super.oninit(vnode);

        const {term} = this.attrs;

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
                    oninput: withAttr('value', (value: string) => {
                        this.name = value;
                        this.slug = slug(value);
                        this.dirty = true;
                    }),
                }),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans(this.translationPrefix() + 'field.slug')),
                m('input.FormControl', {
                    type: 'text',
                    value: this.slug,
                    oninput: withAttr('value', (value: string) => {
                        this.slug = value;
                        this.dirty = true;
                    }),
                }),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans(this.translationPrefix() + 'field.description')),
                m('textarea.FormControl', {
                    value: this.description,
                    oninput: withAttr('value', (value: string) => {
                        this.description = value;
                        this.dirty = true;
                    }),
                }),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans(this.translationPrefix() + 'field.color')),
                m('input.FormControl', {
                    type: 'text',
                    value: this.color,
                    oninput: withAttr('value', (value: string) => {
                        this.color = value;
                        this.dirty = true;
                    }),
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
                    oninput: withAttr('value', (value: string) => {
                        this.icon = value;
                        this.dirty = true;
                    }),
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

    // @ts-ignore wrong Modal.obsubmit typings in Flarum
    onsubmit(event: Event) {
        event.preventDefault();

        this.loading = true;

        const record: Term = this.attrs.term || app.store.createRecord('flamarkt-taxonomy-terms');

        const options: any = {
            errorHandler: this.onerror.bind(this),
        };

        if (this.isNew()) {
            options.url = app.forum.attribute('apiUrl') + this.attrs.taxonomy.apiTermsEndpoint();
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
