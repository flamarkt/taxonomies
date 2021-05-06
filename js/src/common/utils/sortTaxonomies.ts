import Taxonomy from '../models/Taxonomy';

export default function (taxonomies: Taxonomy[] | false): Taxonomy[] {
    // Special case for when retrieving an empty relationship from the store
    if (taxonomies === false) {
        taxonomies = [];
    }

    return taxonomies.slice(0).sort((a, b) => {
        const order = a.order() - b.order();

        if (order !== 0) {
            return order;
        }

        if (a.name() > b.name()) {
            return 1;
        }

        if (a.name() < b.name()) {
            return -1;
        }

        return 0;
    });
}
