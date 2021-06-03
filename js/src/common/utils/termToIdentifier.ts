import Model from 'flarum/common/Model';
import Term from '../models/Term';

/**
 * Prepares a model for a relationship payload
 * We need to keep the name value for custom terms
 */
export default function (term: Term) {
    if (term.id()) {
        return Model.getIdentifier(term);
    }

    return {
        ...Model.getIdentifier(term),
        attributes: {
            name: term.name(),
        },
    }
}
