import Modal from "flarum/common/components/Modal";
import Button from "flarum/common/components/Button";

export default abstract class AbstractEditModal extends Modal {
    dirty: boolean = false;

    className() {
        return 'Modal--small TaxonomyEditModal';
    }

    abstract translationPrefix(): string

    abstract isNew(): boolean

    title() {
        return app.translator.trans(this.translationPrefix() + 'title.' + (this.isNew() ? 'new' : 'edit'));
    }

    abstract form();

    content() {
        return m('.Modal-body', [
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
        ]);
    }

    abstract ondelete();
}
