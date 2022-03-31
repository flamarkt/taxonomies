import app from 'flarum/admin/app';
import makeEveryoneMeansDisabledUsers from './makeEveryoneMeansDisabledUsers';

const translationPrefix = 'flamarkt-taxonomies.admin.permissions.';

// Unique initializer name because we will register this file in both frontends and there will already be a flamarkt-taxonomies initializer
app.initializers.add('flamarkt-taxonomies-admin', () => {
    makeEveryoneMeansDisabledUsers([
        'user.seeOwnTaxonomy',
        'user.editOwnTaxonomy',
    ]);

    app.extensionData.for('flamarkt-taxonomies')
        .registerPermission({
            icon: 'fas fa-tag',
            label: app.translator.trans(translationPrefix + 'moderate'),
            permission: 'taxonomies.moderate',
        }, 'moderate')
        .registerPermission({
            icon: 'fas fa-eye',
            label: app.translator.trans(translationPrefix + 'seeOwnDiscussion'),
            permission: 'discussion.seeOwnTaxonomy',
        }, 'view')
        .registerPermission({
            icon: 'fas fa-eye',
            label: app.translator.trans(translationPrefix + 'seeAnyDiscussion'),
            permission: 'discussion.seeAnyTaxonomy',
            allowGuest: true,
        }, 'view')
        .registerPermission({
            icon: 'fas fa-eye',
            label: app.translator.trans(translationPrefix + 'seeOwnUser'),
            permission: 'user.seeOwnTaxonomy',
            allowGuest: true,
        }, 'view')
        .registerPermission({
            icon: 'fas fa-eye',
            label: app.translator.trans(translationPrefix + 'seeAnyUser'),
            permission: 'user.seeAnyTaxonomy',
            allowGuest: true,
        }, 'view')
        .registerPermission({
            icon: 'fas fa-tag',
            label: app.translator.trans(translationPrefix + 'editOwnDiscussion'),
            permission: 'discussion.editOwnTaxonomy',
        }, 'reply')
        .registerPermission({
            icon: 'fas fa-tag',
            label: app.translator.trans(translationPrefix + 'editAnyDiscussion'),
            permission: 'discussion.editAnyTaxonomy',
        }, 'reply')
        .registerPermission({
            icon: 'fas fa-tag',
            label: app.translator.trans(translationPrefix + 'editOwnUser'),
            permission: 'user.editOwnTaxonomy',
            allowGuest: true,
        }, 'reply')
        .registerPermission({
            icon: 'fas fa-tag',
            label: app.translator.trans(translationPrefix + 'editAnyUser'),
            permission: 'user.editAnyTaxonomy',
        }, 'reply');
});
