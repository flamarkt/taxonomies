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
        taxonomiesHeaderItemsCount?: number
    }
}
