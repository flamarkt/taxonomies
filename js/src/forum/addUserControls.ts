import {extend} from 'flarum/common/extend';
import UserControls from 'flarum/forum/utils/UserControls';
import ItemList from 'flarum/common/utils/ItemList';
import User from 'flarum/common/models/User';
import Button from 'flarum/common/components/Button';
import UserPage from 'flarum/forum/components/UserPage';
import LinkButton from 'flarum/common/components/LinkButton';
import ChooseTaxonomyTermsModal from '../common/components/ChooseTaxonomyTermsModal';
import sortTaxonomies from '../common/utils/sortTaxonomies';

export default function () {
    extend(UserControls, 'userControls', function (items: ItemList, user: User) {
        if (!user.attribute('canEditTaxonomies')) {
            return;
        }

        sortTaxonomies(app.forum.taxonomies()).forEach(taxonomy => {
            if (taxonomy.type() !== 'users') {
                return;
            }

            items.add('taxonomy-' + taxonomy.slug(), Button.component({
                icon: 'fas fa-tag',
                onclick: () => app.modal.show(ChooseTaxonomyTermsModal, {
                    resource: user,
                    taxonomy,
                }),
            }, app.translator.trans('flamarkt-taxonomies.forum.user.edit', {
                taxonomy: taxonomy.name(),
            })));
        });
    });

    extend(UserPage.prototype, 'navItems', function (this: UserPage, items: ItemList) {
        const userTaxonomiesExist = sortTaxonomies(app.forum.taxonomies()).some(taxonomy => {
            return taxonomy.type() === 'users';
        });

        if (!userTaxonomiesExist) {
            return;
        }

        items.add(
            'taxonomies',
            LinkButton.component({
                href: app.route.flamarktTaxonomiesUser(this.user),
                icon: 'fas fa-tags',
            }, app.translator.trans('flamarkt-taxonomies.forum.user.nav')),
            120
        );
    });
}
