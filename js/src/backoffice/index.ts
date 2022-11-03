import app from 'flamarkt/backoffice/backoffice/app';
import {common} from '../common/compat';
import {backoffice} from './compat';
import BackofficeNav from 'flamarkt/backoffice/backoffice/components/BackofficeNav';
import ActiveLinkButton from 'flamarkt/backoffice/common/components/ActiveLinkButton';
import ProductShowPage from 'flamarkt/core/backoffice/pages/ProductShowPage';
import {extend} from 'flarum/common/extend';
import LinkButton from 'flarum/common/components/LinkButton';
import TaxonomiesPage from './components/TaxonomiesPage';
import TaxonomiesRedirectPage from './components/TaxonomiesRedirectPage';
import addModels from '../common/addModels';
import sortTaxonomies from '../common/utils/sortTaxonomies';
import ChooseTaxonomyTermsDropdown from '../common/components/ChooseTaxonomyTermsDropdown';
import SimplifiedTag from './models/SimplifiedTag';

export {
    common,
    backoffice,
};

app.initializers.add('flamarkt-taxonomies', () => {
    addModels();

    // The Tags extension doesn't boot in the backoffice frontend, but we need the model+store so we register it ourselves
    if (!app.store.models.tags) {
        app.store.models.tags = SimplifiedTag;
    }

    app.routes.taxonomies = {
        path: '/taxonomies/:resource',
        component: TaxonomiesPage,
    };

    // This was the old route. We keep it and redirect it to the new one in case it was bookmarked
    app.routes.taxonomiesRedirect = {
        path: '/taxonomies',
        component: TaxonomiesRedirectPage,
    };

    app.extensionData.for('flamarkt-taxonomies').registerSetting(() => {
        return m('.Form-group', LinkButton.component({
            className: 'Button',
            href: app.route('taxonomies'),
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

    if (ProductShowPage) {
        extend(ProductShowPage.prototype, 'fields', function (items) {
            if (!this.product.exists || !this.product.attribute('canEditTaxonomies')) {
                return;
            }

            sortTaxonomies(app.forum.taxonomies()).forEach(taxonomy => {
                if (taxonomy.type() !== 'products') {
                    return;
                }

                items.add('taxonomy-' + taxonomy.slug(), m('.Form-group', [
                    m('label', taxonomy.name()),
                    m(ChooseTaxonomyTermsDropdown, {
                        resource: this.product,
                        taxonomy,
                    }),
                ]), -100);
            });
        });
    }
});
