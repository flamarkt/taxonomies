import Model from 'flarum/common/Model';

export default class Taxonomy extends Model {
    type = Model.attribute<string>('type');
    name = Model.attribute<string>('name');
    slug = Model.attribute<string>('slug');
    description = Model.attribute<string>('description');
    color = Model.attribute<string>('color');
    icon = Model.attribute<string>('icon');
    order = Model.attribute<number>('order');
    showLabel = Model.attribute<boolean>('showLabel');
    showFilter = Model.attribute<boolean>('showFilter');
    allowCustomValues = Model.attribute<boolean>('allowCustomValues');
    customValueValidation = Model.attribute<string | null>('customValueValidation');
    customValueSlugger = Model.attribute<string | null>('customValueSlugger');
    minTerms = Model.attribute<number>('minTerms');
    maxTerms = Model.attribute<number>('maxTerms');
    createdAt = Model.attribute('createdAt', Model.transformDate);
    canSearch = Model.attribute<boolean>('canSearch');

    protected apiEndpoint(): string {
        // @ts-ignore data.id not type-hinted
        return '/flamarkt/taxonomies' + (this.exists ? '/' + this.data.id : '');
    }

    apiOrderEndpoint(): string {
        return this.apiEndpoint() + '/terms/order';
    }

    apiTermsEndpoint(): string {
        return this.apiEndpoint() + '/terms';
    }
}
