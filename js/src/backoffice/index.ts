import BackofficeNav from 'flamarkt/core/backoffice/components/BackofficeNav';
import {extend} from 'flarum/common/extend';
import ItemList from 'flarum/common/utils/ItemList';
import LinkButton from 'flarum/common/components/LinkButton';
import TaxonomiesPage from './components/TaxonomiesPage';
import addModels from '../common/addModels';

app.initializers.add('flamarkt-taxonomies', () => {
    addModels();

    app.routes.taxonomies = {
        path: '/taxonomies',
        component: TaxonomiesPage,
    };

    extend(BackofficeNav.prototype, 'items', function (items: ItemList) {
        items.add('taxonomies', LinkButton.component({
            href: app.route('taxonomies'),
            icon: 'fas fa-tags',
        }, app.translator.trans('flamarkt-taxonomies.admin.menu.title')));
    });
});
