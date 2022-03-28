import Model from 'flarum/common/Model';
import Taxonomy from './Taxonomy';

export default class Term extends Model {
    name = Model.attribute<string>('name');
    slug = Model.attribute<string>('slug');
    description = Model.attribute<string>('description');
    color = Model.attribute<string>('color');
    icon = Model.attribute<string>('icon');
    order = Model.attribute<number>('order');
    createdAt = Model.attribute('createdAt', Model.transformDate);

    taxonomy = Model.hasOne<Taxonomy>('taxonomy');

    protected apiEndpoint(): string {
        // @ts-ignore data.id not type-hinted
        return '/flamarkt/taxonomy-terms' + (this.exists ? '/' + this.data.id : '');
    }
}
