// Mithril
import Mithril, {Component} from 'mithril';

declare global {
    const m: Mithril.Static;

    interface FlarumExports {
        extensions: {
            [id: string]: any,
        }
    }

    const flarum: FlarumExports
}

import ForumApplication from 'flarum/forum/ForumApplication';
import AdminApplication from 'flarum/admin/AdminApplication';
import User from 'flarum/common/models/User';

interface AdditionalApplication {
    route: {
        flamarktTaxonomiesUser(user: User),
    }
}

declare global {
    const app: ForumApplication & AdminApplication & AdditionalApplication;
}

import Taxonomy from './src/common/models/Taxonomy';

declare module 'flarum/common/models/Forum' {
    export default interface Forum {
        taxonomies(): Taxonomy[] | false;
    }
}

declare module 'flarum/common/components/Modal' {
    // <T extends ComponentAttrs = ComponentAttrs> extends Component<T>
    export default interface Modal {
        onsubmit(event: Event): void;
    }
}

import AdminNav from 'flarum/admin/components/AdminNav';

declare module 'flamarkt/core/backoffice/components/BackofficeNav' {
    export default interface BackofficeNav extends AdminNav {
        //
    }
}
