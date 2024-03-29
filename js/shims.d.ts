import Taxonomy from './src/common/models/Taxonomy';

declare module 'flarum/common/models/Forum' {
    export default interface Forum {
        taxonomies(): Taxonomy[] | false;
    }
}

import Term from './src/common/models/Term';
import Tag from 'flarum/tags/common/models/Tag';

declare module 'flarum/forum/components/DiscussionComposer' {
    export default interface DiscussionComposer {
        composer: {
            fields: {
                tags: Tag[]
                taxonomyTerms: {
                    [taxonomyUniqueKey: string]: Term[]
                }
            }
        }
        taxonomiesHeaderItemsCount?: number
    }
}
