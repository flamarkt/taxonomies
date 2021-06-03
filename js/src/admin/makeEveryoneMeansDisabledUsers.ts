import {Vnode} from 'mithril';
import {extend} from 'flarum/common/extend';
import PermissionDropdown from 'flarum/admin/components/PermissionDropdown';
import Button from 'flarum/common/components/Button';

const translationPrefix = 'flamarkt-taxonomies.admin.permissions.';

// Since not activated / suspended users are considered guests, we allow a guest option on some settings
// However showing "Everyone"/"Members" is just confusing, so we will alter the labels on those permissions
export default function (permissionsWhereEveryoneMeansDisabledUsers: string[]) {
    extend(PermissionDropdown.prototype, 'view', function (this: PermissionDropdown, vdom: Vnode) {
        if (permissionsWhereEveryoneMeansDisabledUsers.indexOf(this.attrs.permission) === -1) {
            return;
        }

        // Loops through <ul> children
        vdom.children[1].children.forEach((vdom: Vnode) => {
            // Checks we are in <li> <Button> <icon>
            if (
                vdom.tag !== 'li' ||
                vdom.children[0].tag !== Button ||
                !vdom.children[0].children ||
                vdom.children[0].children.length !== 3
            ) {
                return;
            }

            const {icon} = vdom.children[0].children[0].attrs;

            if (icon === 'fas fa-globe') {
                vdom.children[0].children[2] = [
                    app.translator.trans(translationPrefix + 'ownDisabledEveryone'),
                ];
            }

            if (icon === 'fas fa-user') {
                vdom.children[0].children[2] = [
                    app.translator.trans(translationPrefix + 'ownDisabledMembers'),
                ];
            }
        });
    });
}
