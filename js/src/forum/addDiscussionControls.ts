import {extend} from 'flarum/common/extend';
import DiscussionControls from 'flarum/forum/utils/DiscussionControls';
import ItemList from 'flarum/common/utils/ItemList';
import Discussion from 'flarum/common/models/Discussion';
import Button from 'flarum/common/components/Button';
import ChooseTaxonomyTermsModal from '../common/components/ChooseTaxonomyTermsModal';
import sortTaxonomies from '../common/utils/sortTaxonomies';

export default function () {
    extend(DiscussionControls, 'moderationControls', function (items: ItemList, discussion: Discussion) {
        if (!discussion.attribute('canEditTaxonomies')) {
            return;
        }

        sortTaxonomies(app.forum.taxonomies()).forEach(taxonomy => {
            if (taxonomy.type() !== 'discussions') {
                return;
            }

            items.add('taxonomy-' + taxonomy.slug(), Button.component({
                icon: 'fas fa-tag',
                onclick: () => app.modal.show(ChooseTaxonomyTermsModal, {
                    resource: discussion,
                    taxonomy,
                }),
            }, app.translator.trans('flamarkt-taxonomies.forum.discussion.edit', {
                taxonomy: taxonomy.name(),
            })));
        });
    });
}
