import {Vnode} from 'mithril';
import app from 'flamarkt/backoffice/backoffice/app';
import AbstractEditModal, {AbstractEditModalAttrs} from './AbstractEditModal';
import Taxonomy from '../../common/models/Taxonomy';
import Select from 'flarum/common/components/Select';
import {slug} from 'flarum/common/utils/string';
import withAttr from 'flarum/common/utils/withAttr';
import extractText from 'flarum/common/utils/extractText';
import ItemList from 'flarum/common/utils/ItemList';
import TagRelationshipSelect from './TagRelationshipSelect';
import Tag from 'flarum/tags/common/models/Tag';
import isExtensionEnabled from 'flarum/admin/utils/isExtensionEnabled';

export interface EditTaxonomyModalAttrs extends AbstractEditModalAttrs {
    type?: string
    taxonomy: Taxonomy
    onsave?: (taxonomy: Taxonomy) => void
    ondelete?: () => void
}

export default class EditTaxonomyModal extends AbstractEditModal<EditTaxonomyModalAttrs> {
    type!: string
    name!: string
    slug!: string
    description!: string
    color!: string
    icon!: string
    showLabel!: boolean
    showFilter!: boolean
    enableFilter!: boolean
    enableFulltextSearch!: boolean
    allowCustomValues!: boolean
    customValueValidation!: string
    customValueSlugger!: string
    minTerms!: number | string // Needs string because we leave the field empty for null
    maxTerms!: number | string
    tagIds!: string[]

    loadingTags: boolean = false
    tagsLoaded: boolean = false

    oninit(vnode: Vnode<EditTaxonomyModalAttrs, this>) {
        super.oninit(vnode);

        const {taxonomy} = this.attrs;

        this.type = taxonomy ? taxonomy.type() : (this.attrs.type || 'discussions');
        this.name = taxonomy ? taxonomy.name() : '';
        this.slug = taxonomy ? taxonomy.slug() : '';
        this.description = taxonomy ? taxonomy.description() : '';
        this.color = taxonomy ? taxonomy.color() : '';
        this.icon = taxonomy ? taxonomy.icon() : '';
        this.showLabel = taxonomy ? taxonomy.showLabel() : false;
        this.showFilter = taxonomy ? taxonomy.showFilter() : false;
        this.enableFilter = taxonomy ? taxonomy.enableFilter() : false;
        this.enableFulltextSearch = taxonomy ? taxonomy.enableFulltextSearch() : false;
        this.allowCustomValues = taxonomy ? taxonomy.allowCustomValues() : false;
        this.customValueValidation = (taxonomy ? taxonomy.customValueValidation() : null) || '';
        this.customValueSlugger = (taxonomy ? taxonomy.customValueSlugger() : null) || 'random';
        this.minTerms = taxonomy ? taxonomy.minTerms() : '';
        this.maxTerms = taxonomy ? taxonomy.maxTerms() : '';
        this.tagIds = taxonomy ? taxonomy.tagIds() : [];

        this.loadAllTagsIfNeeded();
    }

    loadAllTagsIfNeeded() {
        if (this.type !== 'discussions' || !isExtensionEnabled('flarum-tags') || this.tagsLoaded || this.loadingTags) {
            return;
        }

        this.loadingTags = true;

        // Load the full list of tags so they can be used by TagRelationshipSelect
        app.store.find('tags', {include: 'parent'}).then(() => {
            this.loadingTags = false;
            this.tagsLoaded = true;

            m.redraw();
        });
    }

    translationPrefix() {
        return 'flamarkt-taxonomies.admin.edit-taxonomy.';
    }

    isNew() {
        return !this.attrs.taxonomy;
    }

    className(): string {
        return 'TaxonomyEditModal TaxonomyModal--withColumns';
    }

    form(): any {
        return m('.TaxonomyModal-Columns', [
            m('.TaxonomyModal-Column', [
                m('h3', app.translator.trans(this.translationPrefix() + 'section.info')),
                this.formItems().toArray(),
            ]),
            m('.TaxonomyModal-Column', [
                m('h3', app.translator.trans(this.translationPrefix() + 'section.filling')),
                this.fillItems().toArray(),
                m('h3', app.translator.trans(this.translationPrefix() + 'section.scope')),
                this.scopeItems().toArray(),
            ]),
            m('.TaxonomyModal-Column', [
                m('h3', app.translator.trans(this.translationPrefix() + 'section.browsing')),
                this.browseItems().toArray(),
            ]),
        ]);
    }

    formItems() {
        const items = new ItemList();

        items.add('name', m('.Form-group', [
            m('label', app.translator.trans(this.translationPrefix() + 'field.name')),
            m('input.FormControl', {
                type: 'text',
                value: this.name,
                oninput: withAttr('value', (value: string) => {
                    // If this is a new taxonomy and the slug has not been manually changed yet,
                    // dynamically set the slug to a sensible value as a name is being typed
                    if (!this.attrs.taxonomy && this.slug === slug(this.name /* old name */)) {
                        this.slug = slug(value);
                    }

                    this.name = value;
                    this.dirty = true;
                }),
            }),
        ]));

        items.add('slug', m('.Form-group', [
            m('label', app.translator.trans(this.translationPrefix() + 'field.slug')),
            m('input.FormControl', {
                type: 'text',
                value: this.slug,
                oninput: withAttr('value', (value: string) => {
                    this.slug = value;
                    this.dirty = true;
                }),
            }),
        ]));

        items.add('description', m('.Form-group', [
            m('label', app.translator.trans(this.translationPrefix() + 'field.description')),
            m('textarea.FormControl', {
                value: this.description,
                oninput: withAttr('value', (value: string) => {
                    this.description = value;
                    this.dirty = true;
                }),
            }),
        ]));

        items.add('color', m('.Form-group', [
            m('label', app.translator.trans(this.translationPrefix() + 'field.color')),
            m('input.FormControl', {
                type: 'text',
                value: this.color,
                oninput: withAttr('value', (value: string) => {
                    this.color = value;
                    this.dirty = true;
                }),
            }),
        ]));

        items.add('icon', m('.Form-group', [
            m('label', app.translator.trans(this.translationPrefix() + 'field.icon')),
            m('.helpText', app.translator.trans(this.translationPrefix() + 'field.iconDescription', {
                a: m('a', {
                    href: 'https://fontawesome.com/icons?m=free',
                    tabindex: -1,
                }),
            })),
            m('input.FormControl', {
                type: 'text',
                value: this.icon,
                oninput: withAttr('value', (value: string) => {
                    this.icon = value;
                    this.dirty = true;
                }),
            }),
        ]));

        return items;
    }

    fillItems() {
        const items = new ItemList();

        items.add('field-counts', m('.Form-group', [
            m('label', app.translator.trans(this.translationPrefix() + 'field.countRequired')),
            m('.helpText', app.translator.trans(this.translationPrefix() + 'field.countRequiredDescription')),
            m('.TaxonomyModal-rangeInput', [
                m('input.FormControl', {
                    type: 'number',
                    min: 0,
                    step: 1,
                    value: this.minTerms,
                    oninput: withAttr('value', (value: string) => {
                        this.minTerms = parseInt(value) || '';
                        this.dirty = true;
                    }),
                }),
                ' ',
                app.translator.trans(this.translationPrefix() + 'field.rangeSeparatorText'),
                ' ',
                m('input.FormControl', {
                    type: 'number',
                    min: 0,
                    step: 1,
                    value: this.maxTerms,
                    oninput: withAttr('value', (value: string) => {
                        this.maxTerms = parseInt(value) || '';
                        this.dirty = true;
                    }),
                }),
            ]),
        ]));

        items.add('allow-custom', m('.Form-group', [
            m('label', [
                m('input', {
                    type: 'checkbox',
                    checked: this.allowCustomValues,
                    onchange: () => {
                        this.allowCustomValues = !this.allowCustomValues;
                        this.dirty = true;
                    },
                }),
                ' ',
                app.translator.trans(this.translationPrefix() + 'field.allowCustomValues'),
            ]),
        ]));

        items.add('validation', m('.Form-group', [
            m('label', app.translator.trans(this.translationPrefix() + 'field.customValueValidation')),
            Select.component({
                options: {
                    '': app.translator.trans(this.translationPrefix() + 'validation-options.default'),
                    alpha_num: app.translator.trans(this.translationPrefix() + 'validation-options.alpha_num'),
                    alpha_dash: app.translator.trans(this.translationPrefix() + 'validation-options.alpha_dash'),
                    regex: app.translator.trans(this.translationPrefix() + 'validation-options.regex'),
                },
                value: this.customValueValidation.indexOf('/') === 0 ? 'regex' : this.customValueValidation,
                onchange: (value: string) => {
                    this.customValueValidation = value === 'regex' ? '//' : value;
                    this.dirty = true;
                },
                disabled: !this.allowCustomValues,
            }),
            this.customValueValidation.indexOf('/') === 0 ? m('.TaxonomyRegexInput', [
                m('span', '/'),
                m('input.FormControl', {
                    type: 'text',
                    value: this.customValueValidation.split('/')[1],
                    oninput: withAttr('value', (value: string) => {
                        this.customValueValidation = '/' + value + '/' + this.customValueValidation.split('/')[2];
                        this.dirty = true;
                    }),
                    disabled: !this.allowCustomValues,
                }),
                m('span', '/'),
                m('input.FormControl', {
                    type: 'text',
                    value: this.customValueValidation.split('/')[2],
                    oninput: withAttr('value', (value: string) => {
                        this.customValueValidation = '/' + this.customValueValidation.split('/')[1] + '/' + value;
                        this.dirty = true;
                    }),
                    disabled: !this.allowCustomValues,
                }),
            ]) : null,
        ]));

        items.add('slugger', m('.Form-group', [
            m('label', app.translator.trans(this.translationPrefix() + 'field.customValueSlugger')),
            m('.helpText', app.translator.trans(this.translationPrefix() + 'field.customValueSluggerDescription')),
            Select.component({
                options: {
                    random: app.translator.trans(this.translationPrefix() + 'slugger-options.random'),
                    alpha_dash: app.translator.trans(this.translationPrefix() + 'slugger-options.alpha_dash'),
                    transliterator: app.translator.trans(this.translationPrefix() + 'slugger-options.transliterator'),
                },
                value: this.customValueSlugger,
                onchange: (value: string) => {
                    this.customValueSlugger = value;
                    this.dirty = true;
                },
                disabled: !this.allowCustomValues,
            }),
        ]));

        return items;
    }

    browseItems() {
        const items = new ItemList();

        items.add('show-label', m('.Form-group', [
            m('label', [
                m('input', {
                    type: 'checkbox',
                    checked: this.showLabel,
                    onchange: () => {
                        this.showLabel = !this.showLabel;
                        this.dirty = true;
                    },
                }),
                ' ',
                app.translator.trans(this.translationPrefix() + 'field.showLabel'),
            ]),
            m('.helpText', app.translator.trans(this.translationPrefix() + 'field.showLabelDescription')),
        ]));

        items.add('enable-filter', m('.Form-group', [
            m('label', [
                m('input', {
                    type: 'checkbox',
                    checked: this.enableFilter,
                    onchange: () => {
                        this.enableFilter = !this.enableFilter;
                        this.dirty = true;

                        if (!this.enableFilter && this.showFilter) {
                            this.showFilter = false;
                        }
                    },
                }),
                ' ',
                app.translator.trans(this.translationPrefix() + 'field.enableFilter'),
            ]),
            m('.helpText', app.translator.trans(this.translationPrefix() + 'field.enableFilterDescription')),
        ]));

        items.add('show-filter', m('.Form-group', [
            m('label', [
                m('input', {
                    type: 'checkbox',
                    checked: this.showFilter,
                    onchange: () => {
                        this.showFilter = !this.showFilter;
                        this.dirty = true;

                        if (this.showFilter && !this.enableFilter) {
                            this.enableFilter = true;
                        }
                    },
                }),
                ' ',
                app.translator.trans(this.translationPrefix() + 'field.showFilter'),
            ]),
            m('.helpText', app.translator.trans(this.translationPrefix() + 'field.showFilterDescription')),
        ]));

        const accessDiffers = app.forum.attribute<any>('taxonomiesFulltextAccessDiffersFromFilter') || {};

        items.add('enable-fulltext-search', m('.Form-group', [
            m('label', [
                m('input', {
                    type: 'checkbox',
                    checked: this.enableFulltextSearch,
                    onchange: () => {
                        this.enableFulltextSearch = !this.enableFulltextSearch;
                        this.dirty = true;
                    },
                }),
                ' ',
                app.translator.trans(this.translationPrefix() + 'field.enableFulltextSearch'),
            ]),
            accessDiffers[this.type] ? m('.Alert', app.translator.trans(this.translationPrefix() + 'field.enableFulltextSearchWarning')) : null,
            m('.helpText', app.translator.trans(this.translationPrefix() + 'field.enableFulltextSearchDescription')),
        ]));

        return items;
    }

    scopeItems() {
        const items = new ItemList();

        const options: any = {
            discussions: app.translator.trans(this.translationPrefix() + 'type-options.discussions'),
            users: app.translator.trans(this.translationPrefix() + 'type-options.users'),
        };

        if ('flamarkt-core' in flarum.extensions || this.type === 'products') {
            options.products = app.translator.trans(this.translationPrefix() + 'type-options.products');
        }

        items.add('type', m('.Form-group', [
            m('label', app.translator.trans(this.translationPrefix() + 'field.type')),
            m('.helpText', app.translator.trans(this.translationPrefix() + 'field.typeDescription')),
            Select.component({
                options,
                value: this.type,
                onchange: (value: string) => {
                    this.type = value;
                    this.dirty = true;

                    this.loadAllTagsIfNeeded();
                },
                disabled: !this.isNew(),
            }),
        ]));

        if (this.type === 'discussions' && isExtensionEnabled('flarum-tags')) {
            items.add('tags', m('.Form-group', [
                m('label', app.translator.trans(this.translationPrefix() + 'field.tagScope')),
                m('.helpText', app.translator.trans(this.translationPrefix() + 'field.tagScopeDescription')),
                TagRelationshipSelect.component({
                    relationship: this.tagIds.map(tagId => {
                        return app.store.getById('tags', tagId) || app.store.createRecord('tags', {
                            id: tagId,
                            attributes: {},
                        });
                    }),
                    onchange: (tags: Tag[]) => {
                        this.tagIds = tags.map(tag => tag.id() || '');
                        this.dirty = true;
                    },
                    placeholder: app.translator.trans(this.translationPrefix() + 'field.tagScopePlaceholder'),
                }),
            ]));
        }

        return items;
    }

    ondelete() {
        if (!confirm(extractText(app.translator.trans(this.translationPrefix() + 'deleteConfirmation', {
            name: this.attrs.taxonomy.name(),
        })))) {
            return;
        }

        this.loading = true;

        this.attrs.taxonomy.delete({
            errorHandler: this.onerror.bind(this),
        }).then(() => {
            app.modal.close();

            if (this.attrs.ondelete) {
                this.attrs.ondelete();
            }
        }, () => {
            this.loaded();
        });
    }

    // @ts-ignore wrong Modal.obsubmit typings in Flarum
    onsubmit(event: Event) {
        event.preventDefault();

        this.loading = true;

        const record: Taxonomy = this.attrs.taxonomy || app.store.createRecord('flamarkt-taxonomies');

        record.save({
            type: this.type,
            name: this.name,
            slug: this.slug,
            description: this.description,
            color: this.color,
            icon: this.icon,
            show_label: this.showLabel,
            show_filter: this.showFilter,
            enable_filter: this.enableFilter,
            enable_fulltext_search: this.enableFulltextSearch,
            allow_custom_values: this.allowCustomValues,
            custom_value_validation: this.customValueValidation,
            custom_value_slugger: this.customValueSlugger,
            min_terms: this.minTerms,
            max_terms: this.maxTerms,
            tag_ids: this.tagIds,
        }, {
            errorHandler: this.onerror.bind(this),
        }).then(record => {
            app.modal.close();

            if (this.attrs.onsave) {
                this.attrs.onsave(record);
            }
        }, () => {
            this.loaded();
        });
    }
}
