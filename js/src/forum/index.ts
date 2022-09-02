import app from 'flarum/forum/app';
import {common} from '../common/compat';
import {forum} from './compat';
import addBlogContent from './addBlogContent';
import addComposerControls, {delayedComposerHooks} from './addComposerControls';
import addDiscussionControls from './addDiscussionControls';
import addIndexFilters from './addIndexFilters';
import addLabels from './addLabels';
import addPages from './addPages';
import addProductFilters from './addProductFilters';
import addUserControls from './addUserControls';
import addModels from '../common/addModels';
import addUserDirectorySearchType from './addUserDirectorySearchType';

export {
    common,
    forum,
};

app.initializers.add('flamarkt-taxonomies', () => {
    addBlogContent();
    addComposerControls();
    addDiscussionControls();
    addIndexFilters();
    addLabels();
    addPages();
    addProductFilters();
    addUserControls();
    addModels();
    addUserDirectorySearchType();
});

app.initializers.add('flamarkt-taxonomies-delayed', delayedComposerHooks, -500);
