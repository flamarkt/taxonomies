import app from 'flamarkt/backoffice/backoffice/app';
import Page from 'flarum/common/components/Page';

export default class TaxonomiesRedirectPage extends Page {
    oninit(vnode: any) {
        super.oninit(vnode);

        m.route.set(app.route('taxonomies', {
            resource: 'discussions',
        }));
    }

    view() {
        return null;
    }
}
