import addComposerControls from './addComposerControls';
import addDiscussionControls from './addDiscussionControls';
import addIndexFilters from './addIndexFilters';
import addLabels from './addLabels';
import addPages from './addPages';
import addProductFilters from './addProductFilters';
import addUserControls from './addUserControls';
import addModels from '../common/addModels';
import addUserDirectorySearchType from './addUserDirectorySearchType';

app.initializers.add('flamarkt-taxonomies', () => {
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
