import Model from 'flarum/common/Model';
import Taxonomy from './Taxonomy';

export default class Term extends Model {
    name = Model.attribute('name');
    slug = Model.attribute('slug');
    description = Model.attribute('description');
    color = Model.attribute('color');
    icon = Model.attribute('icon');
    order = Model.attribute('order');
    createdAt = Model.attribute('createdAt', Model.transformDate);

    taxonomy: () => Taxonomy | false = Model.hasOne('taxonomy');

    protected apiEndpoint(): string {
        return '/flamarkt/taxonomy-terms' + (this.exists ? '/' + this.data.id : '');
    }
}
