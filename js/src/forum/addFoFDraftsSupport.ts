import app from 'flarum/forum/app';
import {extend} from 'flarum/common/extend';
import Model from 'flarum/common/Model';
import Term from '../common/models/Term';
import Taxonomy from '../common/models/Taxonomy';
import retrieveTerms from '../common/utils/retrieveTerms';

interface Draft extends Model {
    relationships(): any

    loadRelationships(): any
}

export default function () {
    const fofDraftsExports: any = flarum.extensions['fof-drafts'];

    if (fofDraftsExports && fofDraftsExports.models && fofDraftsExports.models.Draft) {
        extend(fofDraftsExports.models.Draft.prototype, 'loadRelationships', function (this: Draft, loadedRelationships: any) {
            const relationships = this.relationships();

            if (relationships && relationships.taxonomies && relationships.taxonomies.data.length) {
                // fof/drafts first saves the value to this.loadedRelationships before returning it
                // Since it's passed by reference we should be able to just edit the extended value and the property on the model will also update
                loadedRelationships.taxonomyTerms = {};

                relationships.taxonomies.data.forEach((taxonomyData: any) => {
                    if (!taxonomyData) {
                        console.warn('[flamarkt-taxonomies + fof/drafts] No data for taxonomy in saved relationship');
                        return;
                    }

                    const taxonomyOfGroup = app.store.getById<Taxonomy>('flamarkt-taxonomies', taxonomyData.id);

                    if (!taxonomyOfGroup) {
                        console.warn('[flamarkt-taxonomies + fof/drafts] Invalid taxonomy #' + taxonomyData.id);
                        return;
                    }

                    if (taxonomyOfGroup.type() !== 'discussions') {
                        console.warn('[flamarkt-taxonomies + fof/drafts] Invalid taxonomy #' + taxonomyData.id);
                        return;
                    }

                    // Unfortunately there is no easy way to check applies() because we don't have access to the composer here

                    if (taxonomyData.relationships && taxonomyData.relationships.terms && taxonomyData.relationships.terms.data && taxonomyData.relationships.terms.data.length) {
                        const termIdsToLoadAsynchronously: string[] = [];

                        function addTerm(term: Term) {
                            const idAsString = taxonomyOfGroup!.id()!;
                            if (!loadedRelationships.taxonomyTerms[idAsString]) {
                                loadedRelationships.taxonomyTerms[idAsString] = [];
                            }

                            loadedRelationships.taxonomyTerms[idAsString].push(term);
                        }

                        taxonomyData.relationships.terms.data.forEach((termData: any) => {
                            if (termData.id) {
                                // Try to retrieve term from store
                                const term = app.store.getById<any>('flamarkt-taxonomy-terms', termData.id);

                                // Not in store, load all available terms
                                if (!term) {
                                    termIdsToLoadAsynchronously.push(termData.id);
                                    return;
                                }

                                const taxonomy = term.taxonomy();

                                if (!taxonomy) {
                                    console.warn('[flamarkt-taxonomies + fof/drafts] Taxonomy for Term #' + termData.id + ' not available');
                                    return;
                                }

                                if (taxonomy !== taxonomyOfGroup) {
                                    console.warn('[flamarkt-taxonomies + fof/drafts] Invalid Term #' + termData.id + '; taxonomy mismatch');
                                    return;
                                }

                                addTerm(term);
                            } else if (termData.attributes && termData.attributes.name) {
                                addTerm(app.store.createRecord('flamarkt-taxonomy-terms', {
                                    attributes: {
                                        name: termData.attributes.name,
                                    },
                                }));
                            }
                        });

                        if (termIdsToLoadAsynchronously.length) {
                            // This request should be skipped next time since all terms will have been found in the store
                            // Unfortunately we still get a bunch of identical requests at once when loading the drafts dropdown since this method is called when drawing the list
                            retrieveTerms(taxonomyOfGroup).then(terms => {
                                terms.forEach(term => {
                                    const index = termIdsToLoadAsynchronously.indexOf(term.id()!);

                                    if (index !== -1) {
                                        // We should still be able to add to the original object asynchronously
                                        // Since it will then be copied by reference
                                        addTerm(term);

                                        termIdsToLoadAsynchronously.splice(index, 1);
                                    }
                                });

                                termIdsToLoadAsynchronously.forEach(id => {
                                    console.warn('[flamarkt-taxonomies + fof/drafts] Failed to load term #' + id + '; asynchronously: not found');
                                });

                                m.redraw();
                            });
                        }
                    }
                });
            }
        });
    }
}
