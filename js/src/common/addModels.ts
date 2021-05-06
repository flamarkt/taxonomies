import Taxonomy from './models/Taxonomy';
import Term from './models/Term';

export default function () {
    app.store.models['flamarkt-taxonomies'] = Taxonomy;
    app.store.models['flamarkt-taxonomy-terms'] = Term;
}
