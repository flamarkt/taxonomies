import Model from 'flarum/common/Model';
import computed from 'flarum/common/utils/computed';

export default class Taxonomy extends Model {
    type = Model.attribute('type');
    name = Model.attribute('name');
    slug = Model.attribute('slug');
    description = Model.attribute('description');
    color = Model.attribute('color');
    icon = Model.attribute('icon');
    order = Model.attribute('order');
    showLabel = Model.attribute('showLabel');
    showFilter = Model.attribute('showFilter');
    allowCustomValues = Model.attribute('allowCustomValues');
    customValueValidation = Model.attribute('customValueValidation');
    customValueSlugger = Model.attribute('customValueSlugger');
    minTerms = Model.attribute('minTerms');
    maxTerms = Model.attribute('maxTerms');
    createdAt = Model.attribute('createdAt', Model.transformDate);
    canSearchDiscussions = Model.attribute('canSearchDiscussions');
    canSearchUsers = Model.attribute('canSearchUsers');

    // Used to store the terms on the DiscussionComposer, never visible or part of the DOM
    uniqueKey = computed('id', id => 'taxonomy' + id);

    protected apiEndpoint(): string {
        return '/flamarkt/taxonomies' + (this.exists ? '/' + this.data.id : '');
    }

    apiOrderEndpoint(): string {
        return this.apiEndpoint() + '/terms/order';
    }
}
