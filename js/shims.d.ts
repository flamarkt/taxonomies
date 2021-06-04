import Mithril from 'mithril';

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

import Term from './src/common/models/Term';

declare module 'flarum/forum/components/DiscussionComposer' {
    export default interface DiscussionComposer {
        selectedTaxonomyTerms: {
            [taxonomyUniqueKey: string]: Term[]
        }
    }
}
