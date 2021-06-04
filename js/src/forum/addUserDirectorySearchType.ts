import {extend} from 'flarum/common/extend';
import icon from 'flarum/common/helpers/icon';
import ItemList from 'flarum/common/utils/ItemList';
import Term from '../common/models/Term';

export default function () {
    // Verify User Directory is enabled and exports all the classes we need
    if (
        !flarum.extensions['fof-user-directory'] ||
        !flarum.extensions['fof-user-directory'].searchTypes ||
        !flarum.extensions['fof-user-directory'].searchTypes.AbstractType ||
        !flarum.extensions['fof-user-directory'].components ||
        !flarum.extensions['fof-user-directory'].components.SearchField
    ) {
        return;
    }

    // Class must be defined here because it needs to extend the base class
    // Which might not be available yet when imports are resolved
    class TaxonomyTermType extends flarum.extensions['fof-user-directory'].searchTypes.AbstractType {
        allTerms: Term[] | null = null
        loadingAllTermsPromise: Promise<void> | null = null
        loading: boolean = false
        suggestions: Term[] = []

        resourceType() {
            return 'flamarkt-taxonomy-terms';
        }

        search(query: string) {
            this.loading = true;

            this.loadTerms().then(() => {
                this.loading = false;
                this.suggestions = [];

                if (!query) {
                    m.redraw();

                    return;
                }

                query = query.toLowerCase();

                this.allTerms.forEach(term => {
                    if (term.name().toLowerCase().indexOf(query) !== -1) {
                        this.suggestions.push(term);
                    }
                });

                m.redraw();
            });
        }

        loadTerms() {
            if (this.loadingAllTermsPromise) {
                return this.loadingAllTermsPromise;
            }

            if (this.allTerms !== null) {
                return Promise.resolve(null);
            }

            this.allTerms = [];

            const promises: Promise<void>[] = [];

            app.store.all('flamarkt-taxonomies').forEach(taxonomy => {
                if (!taxonomy.canSearchUsers() || !taxonomy.showFilter()) {
                    return;
                }

                promises.push(app.request({
                    method: 'GET',
                    url: app.forum.attribute('apiUrl') + taxonomy.apiEndpoint() + '/terms',
                }).then(result => {
                    const terms = app.store.pushPayload(result);

                    terms.forEach((term: Term) => {
                        term.pushData({
                            relationships: {
                                taxonomy,
                            },
                        });
                    });

                    this.allTerms.push(...terms);
                }));
            });

            this.loadingAllTermsPromise = Promise.all(promises);

            return this.loadingAllTermsPromise.then(() => {
                this.loadingAllTermsPromise = null;
            });
        }

        renderKind(term: Term) {
            return term.taxonomy().name();
        }

        renderLabel(term: Term) {
            return m('.UserDirectorySearchLabel', term.color() ? {
                className: 'colored',
                style: {
                    backgroundColor: term.color(),
                },
            } : {}, [
                term.icon() ? [
                    icon(term.icon()),
                    ' ',
                ] : null,
                term.name(),
            ]);
        }

        applyFilter(params: any, resource: any) {
            params.q = params.q ? params.q + ' ' : '';
            params.q += 'taxonomy:' + resource.taxonomy().slug() + ':' + resource.slug();
        }

        initializeFromParams(params) {
            if (!params.q) {
                return Promise.resolve([]);
            }

            const gambits: string[] = params.q.split(' ').filter(word => word.indexOf('taxonomy:') === 0);

            if (!gambits.length) {
                return Promise.resolve([]);
            }

            return this.loadTerms().then(() => {
                const terms: Term[] = [];

                gambits.forEach(gambit => {
                    const parts = gambit.split(':');

                    if (parts.length < 3) {
                        return;
                    }

                    const term = this.allTerms.find(t => t.slug() === parts[2] && t.taxonomy().slug() === parts[1]);

                    if (term) {
                        terms.push(term);
                    }
                });

                return terms;
            });
        }
    }

    extend(flarum.extensions['fof-user-directory'].components.SearchField.prototype, 'filterTypes', function (items: ItemList) {
        items.add('flamarkt-taxonomies', new TaxonomyTermType(), 15);
    });
}
