import {Children} from 'mithril';
import app from 'flamarkt/backoffice/backoffice/app';
import Modal, {IInternalModalAttrs} from 'flarum/common/components/Modal';
import Alert from 'flarum/common/components/Alert';
import Button from 'flarum/common/components/Button';

export interface AbstractEditModalAttrs extends IInternalModalAttrs {
    // nothing special, but it's easier to import a parent class from here from the sub classes
}

export default abstract class AbstractEditModal<ModalAttrs extends AbstractEditModalAttrs = AbstractEditModalAttrs> extends Modal<ModalAttrs> {
    dirty: boolean = false;

    className() {
        return 'Modal--small TaxonomyEditModal';
    }

    abstract translationPrefix(): string

    abstract isNew(): boolean

    title() {
        return app.translator.trans(this.translationPrefix() + 'title.' + (this.isNew() ? 'new' : 'edit'));
    }

    abstract form(): Children;

    content() {
        return [
            m('.Modal-body', [
                this.form(),
                m('.FormGroup', [
                    Button.component({
                        type: 'submit',
                        className: 'Button Button--primary',
                        loading: this.loading,
                        disabled: !this.dirty,
                    }, app.translator.trans(this.translationPrefix() + 'submit.' + (this.isNew() ? 'new' : 'edit'))),
                    ' ',
                    this.isNew() ? null : Button.component({
                        className: 'Button Button--link TaxonomyEditModal-delete',
                        loading: this.loading,
                        onclick: this.ondelete.bind(this),
                    }, app.translator.trans(this.translationPrefix() + 'delete')),
                ]),
            ]),

            // Since the modal is so tall, you don't see the errors when you click the submit button
            // We will repeat the alert at the bottom so it's more obvious you have errors
            this.alertAttrs ? m('.Modal-alert', Alert.component(this.alertAttrs)) : null,
        ];
    }

    abstract ondelete(): void;
}
