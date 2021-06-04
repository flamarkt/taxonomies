import {extend, override} from 'flarum/common/extend';
import DiscussionComposer from 'flarum/forum/components/DiscussionComposer';
import ItemList from 'flarum/common/utils/ItemList';
import icon from 'flarum/common/helpers/icon';
import ChooseTaxonomyTermsModal from '../common/components/ChooseTaxonomyTermsModal';
import termsLabel from '../common/helpers/termsLabel';
import sortTaxonomies from '../common/utils/sortTaxonomies';
import termToIdentifier from '../common/utils/termToIdentifier';
import Term from '../common/models/Term';

export default function () {
    extend(DiscussionComposer.prototype, 'oninit', function (this: DiscussionComposer) {
        this.selectedTaxonomyTerms = {};
    });

    extend(DiscussionComposer.prototype, 'headerItems', function (this: DiscussionComposer, items: ItemList) {
        sortTaxonomies(app.forum.taxonomies()).forEach(taxonomy => {
            if (taxonomy.type() !== 'discussions') {
                return;
            }

            items.add('taxonomy-' + taxonomy.slug(), m('a.DiscussionComposer-changeTaxonomies', {
                    onclick: () => {
                        app.modal.show(ChooseTaxonomyTermsModal, {
                            taxonomy,
                            selectedTerms: (this.selectedTaxonomyTerms[taxonomy.id()] || []).slice(0),
                            onsubmit: (terms: Term[]) => {
                                this.selectedTaxonomyTerms[taxonomy.id()] = terms;
                                this.$('textarea').trigger('focus');
                            },
                        });
                    },
                }, this.selectedTaxonomyTerms[taxonomy.id()] && this.selectedTaxonomyTerms[taxonomy.id()].length
                ? termsLabel(this.selectedTaxonomyTerms[taxonomy.id()], {
                    taxonomy,
                })
                : m('span.TaxonomyLabel.untagged', [
                    taxonomy.icon() ? [icon(taxonomy.icon()), ' '] : null,
                    app.translator.trans('flamarkt-taxonomies.forum.composer.choose', {
                        taxonomy: taxonomy.name(),
                    }),
                ])
            ), 9); // Tags uses 10, we add ours right to the tagson the right of the tags
        });
    });

    override(DiscussionComposer.prototype, 'onsubmit', function (this: DiscussionComposer, original: any) {
        // Zero timeout to change the execution thread and let the modal close in TagDiscussionModal / ChooseTaxonomyTermsModal
        // before we try opening another one
        const callbacks: ((resolve: () => void) => void)[] = [];

        sortTaxonomies(app.forum.taxonomies()).forEach(taxonomy => {
            if (taxonomy.type() !== 'discussions') {
                return;
            }

            const count = (this.selectedTaxonomyTerms[taxonomy.id()] || []).length;

            if (taxonomy.minTerms() && count < taxonomy.minTerms()) {
                callbacks.push(resolve => {
                    app.modal.show(ChooseTaxonomyTermsModal, {
                        taxonomy,
                        selectedTags: (this.selectedTaxonomyTerms[taxonomy.id()] || []).slice(0),
                        onsubmit: (terms: Term[]) => {
                            this.selectedTaxonomyTerms[taxonomy.id()] = terms;
                            resolve();
                        },
                    });
                });
            }
        });

        if (callbacks.length) {
            const callNextCallback = () => {
                if (!callbacks.length) {
                    original();

                    return;
                }

                new Promise(callbacks.shift() as any).then(() => {
                    // We give time for the modal to close before opening another one
                    // Opening a different modal without closing the first one is very difficult because app.modal.show
                    // Would have to be called in the same thread that just called app.modal.close and it's very difficult
                    // We also apply that delay after our last modal in case Tags' modal shows up after ours
                    setTimeout(() => {
                        callNextCallback();
                    }, 400); // 300ms is bootstrap's default Modal.TRANSITION_DURATION and we add a bit of delay
                });
            }

            if (app.modal.modal) {
                // In case Tags' modal is currently visible (their override ran before ours) we wait for it to close
                // We have no other option because our override is called from TagDiscussionModal.props.onsubmit
                // at which point app.modal.close has not been called yet
                setTimeout(() => {
                    callNextCallback();
                }, 400);
            } else {
                callNextCallback();
            }
        } else {
            original();
        }
    });

    extend(DiscussionComposer.prototype, 'data', function (this: DiscussionComposer, data: any) {
        const taxonomyData: any[] = [];

        // We put all term IDs from all taxonomies together for the request
        (app.forum.taxonomies() || []).forEach(taxonomy => {
            if (taxonomy.type() !== 'discussions') {
                return;
            }

            if (this.selectedTaxonomyTerms[taxonomy.id()] && this.selectedTaxonomyTerms[taxonomy.id()].length) {
                taxonomyData.push({
                    verbatim: true, // Flarum workaround, defined in flamarkt/core
                    type: 'flamarkt-taxonomies',
                    id: taxonomy.id(),
                    relationships: {
                        terms: {
                            data: this.selectedTaxonomyTerms[taxonomy.id()].map(termToIdentifier),
                        },
                    },
                });
            }
        });

        data.relationships = data.relationships || {};
        data.relationships.taxonomies = taxonomyData;
    });
}
