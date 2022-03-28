import {extend} from 'flarum/common/extend';
import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import DiscussionHero from 'flarum/forum/components/DiscussionHero';
import labelsFromMultipleTaxonomiesList from '../common/helpers/labelsFromMultipleTaxonomiesList';

export default function () {
    extend(DiscussionListItem.prototype, 'infoItems', function (items) {
        const terms = this.attrs.discussion.taxonomyTerms();

        if (terms && terms.length) {
            items.add('taxonomies', labelsFromMultipleTaxonomiesList(terms), 10);
        }
    });

    extend(DiscussionHero.prototype, 'items', function (items) {
        const terms = this.attrs.discussion.taxonomyTerms();

        if (terms && terms.length) {
            items.add('taxonomies', labelsFromMultipleTaxonomiesList(terms, {discussionLink: true}), 5);
        }
    });
}
