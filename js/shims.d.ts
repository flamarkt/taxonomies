// Mithril
import Mithril, {Component} from 'mithril';

declare global {
    const m: Mithril.Static;
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

// Fix wrong signatures from Flarum
declare module 'flarum/common/Translator' {
    export default interface Translator {
        // Make second parameter optional
        trans(id: any, parameters?: any): any;
    }
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
