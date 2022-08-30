import {extend} from 'flarum/common/extend';
import ItemList from 'flarum/common/utils/ItemList';
import app from 'flarum/forum/app';
import labelsFromMultipleTaxonomiesList from '../common/helpers/labelsFromMultipleTaxonomiesList';

export default function () {
    if ('v17development/blog/components/BlogItemSidebar' in flarum.core.compat) {
        extend(flarum.core.compat['v17development/blog/components/BlogItemSidebar'].prototype, 'items', function (items: ItemList<any>) {
            // All items have the same priority in the original extension, so we'll move author even more to the top so we can squeeze below it
            // Same code and priority as in clarkwinkelmann-discussion-lists
            items.setPriority('author', 50);
            items.setPriority('categories', 30);

            const {article} = this.attrs;

            if (!article) {
                return;
            }

            const terms = article.taxonomyTerms();

            if (terms && terms.length) {
                items.add('taxonomies', m('.BlogTaxonomies.BlogSideWidget', [
                    m('h3', app.translator.trans('flamarkt-taxonomies.forum.blog.widget.title')),
                    m('.BlogTaxonomiesContainer', labelsFromMultipleTaxonomiesList(terms, {discussionLink: true})),
                ]), 29);
            }
        });
    }
}
