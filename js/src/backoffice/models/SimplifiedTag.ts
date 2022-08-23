import Model from 'flarum/common/Model';
import computed from 'flarum/common/utils/computed';

// A stripped-down model of Tags for our own use
export default class SimplifiedTag extends Model {
    name = Model.attribute<string>('name');

    isPrimary() {
        return computed<boolean, this>('position', 'parent', (position, parent) => position !== null && parent === false).call(this);
    }
}
