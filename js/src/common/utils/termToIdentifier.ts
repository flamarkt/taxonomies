import Model from 'flarum/common/Model';

/**
 * Prepares a model for a relationship payload
 * We need to keep the name value for custom terms
 */
export default function (term) {
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
