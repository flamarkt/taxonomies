import app from 'flarum/common/app';
import {ApiPayloadPlural, ApiResponsePlural} from 'flarum/common/Store';
import Taxonomy from '../models/Taxonomy';
import Term from '../models/Term';

export default function (taxonomy: Taxonomy): Promise<ApiResponsePlural<Term>> {
    return app.request<ApiPayloadPlural>({
        method: 'GET',
        url: app.forum.attribute('apiUrl') + taxonomy.apiTermsEndpoint(),
    }).then(result => {
        const terms = app.store.pushPayload<Term[]>(result);

        // For consistency, we will always set the "inverse" relationship while retrieving
        // Since most of the code relies on this relationship being loaded
        terms.forEach(term => {
            term.pushData({
                relationships: {
                    taxonomy,
                },
            });
        })

        return terms;
    });
}
