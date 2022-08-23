import app from 'flarum/common/app';
import highlight from 'flarum/common/helpers/highlight';
import AbstractRelationshipSelect from 'flamarkt/backoffice/common/components/AbstractRelationshipSelect';
import SimplifiedTag from '../models/SimplifiedTag';

export default class TagRelationshipSelect extends AbstractRelationshipSelect<SimplifiedTag> {
    className() {
        return 'TagRelationshipSelect';
    }

    search(query: string) {
        // Since this method is debounced, we need to force a redraw when ready
        m.redraw();

        // Do nothing, we will filter the list of tags client-side
        return Promise.resolve();
    }

    results(query: string) {
        if (!query) {
            return [];
        }

        query = query.toLowerCase();

        return app.store
            .all<SimplifiedTag>('tags')
            .filter(tag => {
                return tag.name().toLowerCase().substr(0, query.length) === query;
            });
    }

    item(tag: SimplifiedTag, query?: string) {
        return highlight(tag.name(), query);
    }
}
