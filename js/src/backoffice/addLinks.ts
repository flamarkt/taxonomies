import app from 'flamarkt/backoffice/backoffice/app';
import BackofficeNav from 'flamarkt/backoffice/backoffice/components/BackofficeNav';
import ActiveLinkButton from 'flamarkt/backoffice/common/components/ActiveLinkButton';
import {extend} from 'flarum/common/extend';
import LinkButton from 'flarum/common/components/LinkButton';

export default function () {
    app.extensionData.for('flamarkt-taxonomies').registerSetting(() => {
        return m('.Form-group', LinkButton.component({
            className: 'Button',
            href: app.route('taxonomies', {
                resource: 'discussions',
            }),
        }, app.translator.trans('flamarkt-taxonomies.admin.settings.goToPage')));
    });

    extend(BackofficeNav.prototype, 'items', function (items) {
        items.add('taxonomies', ActiveLinkButton.component({
            href: app.route('taxonomies', {
                resource: 'discussions',
            }),
            icon: 'fas fa-tags',
            activeRoutes: [
                'taxonomies',
            ],
        }, app.translator.trans('flamarkt-taxonomies.admin.menu.title')), 15);

        const currentRouteName = (app.current.data as any).routeName;

        if (currentRouteName === 'taxonomies') {
            items.add('taxonomies-discussions', LinkButton.component({
                className: 'TaxonomiesChildNav',
                href: app.route('taxonomies', {
                    resource: 'discussions',
                }),
                icon: 'fas fa-comments',
            }, app.translator.trans('flamarkt-taxonomies.admin.menu.discussions')), 15);

            items.add('taxonomies-users', LinkButton.component({
                className: 'TaxonomiesChildNav',
                href: app.route('taxonomies', {
                    resource: 'users',
                }),
                icon: 'fas fa-user-tag',
            }, app.translator.trans('flamarkt-taxonomies.admin.menu.users')), 15);

            if ('flamarkt-core' in flarum.extensions) {
                items.add('taxonomies-products', LinkButton.component({
                    className: 'TaxonomiesChildNav',
                    href: app.route('taxonomies', {
                        resource: 'products',
                    }),
                    icon: 'fas fa-box',
                }, app.translator.trans('flamarkt-taxonomies.admin.menu.products')), 15);
            }
        }
    });
}
