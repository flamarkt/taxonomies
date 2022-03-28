import app from 'flarum/forum/app';
import {extend, override} from 'flarum/common/extend';
import DiscussionComposer from 'flarum/forum/components/DiscussionComposer';
import icon from 'flarum/common/helpers/icon';
import ChooseTaxonomyTermsModal from '../common/components/ChooseTaxonomyTermsModal';
import termsLabel from '../common/helpers/termsLabel';
import sortTaxonomies from '../common/utils/sortTaxonomies';
import termToIdentifier from '../common/utils/termToIdentifier';
import Term from '../common/models/Term';

export default function () {
    extend(DiscussionComposer.prototype, 'oninit', function () {
        this.selectedTaxonomyTerms = {};
    });

    extend(DiscussionComposer.prototype, 'headerItems', function (items) {
        sortTaxonomies(app.forum.taxonomies()).forEach(taxonomy => {
            const taxonomyId = taxonomy.id();

            if (taxonomy.type() !== 'discussions' || !taxonomyId) {
                return;
            }

            items.add('taxonomy-' + taxonomy.slug(), m('a.DiscussionComposer-changeTaxonomies', {
                    onclick: () => {
                        app.modal.show(ChooseTaxonomyTermsModal, {
                            taxonomy,
                            selectedTerms: (this.selectedTaxonomyTerms[taxonomyId] || []).slice(0),
                            onsubmit: (terms: Term[]) => {
                                this.selectedTaxonomyTerms[taxonomy.id()!] = terms;
                                this.$('textarea').trigger('focus');
                            },
                        });
                    },
                }, this.selectedTaxonomyTerms[taxonomyId] && this.selectedTaxonomyTerms[taxonomyId].length
                    ? termsLabel(this.selectedTaxonomyTerms[taxonomyId], {
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

    override(DiscussionComposer.prototype, 'onsubmit', function (original) {
        // Zero timeout to change the execution thread and let the modal close in TagDiscussionModal / ChooseTaxonomyTermsModal
        // before we try opening another one
        const callbacks: ((resolve: () => void) => void)[] = [];

        sortTaxonomies(app.forum.taxonomies()).forEach(taxonomy => {
            const taxonomyId = taxonomy.id();

            if (taxonomy.type() !== 'discussions' || !taxonomyId) {
                return;
            }

            const count = (this.selectedTaxonomyTerms[taxonomyId] || []).length;

            if (taxonomy.minTerms() && count < taxonomy.minTerms()) {
                callbacks.push(resolve => {
                    app.modal.show(ChooseTaxonomyTermsModal, {
                        taxonomy,
                        selectedTags: (this.selectedTaxonomyTerms[taxonomyId] || []).slice(0),
                        onsubmit: (terms: Term[]) => {
                            this.selectedTaxonomyTerms[taxonomyId] = terms;
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

    extend(DiscussionComposer.prototype, 'data', function (data) {
        const taxonomyData: any[] = [];

        // We put all term IDs from all taxonomies together for the request
        (app.forum.taxonomies() || []).forEach(taxonomy => {
            const taxonomyId = taxonomy.id();

            if (taxonomy.type() !== 'discussions' || !taxonomyId) {
                return;
            }

            if (this.selectedTaxonomyTerms[taxonomyId] && this.selectedTaxonomyTerms[taxonomyId].length) {
                taxonomyData.push({
                    verbatim: true, // Flarum workaround, defined in flamarkt/core
                    type: 'flamarkt-taxonomies',
                    id: taxonomyId,
                    relationships: {
                        terms: {
                            data: this.selectedTaxonomyTerms[taxonomyId].map(termToIdentifier),
                        },
                    },
                });
            }
        });

        data.relationships = data.relationships || {};
        data.relationships.taxonomies = taxonomyData;
    });
}
