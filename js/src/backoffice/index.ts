import app from 'flamarkt/backoffice/backoffice/app';
import {common} from '../common/compat';
import {backoffice} from './compat';
import addModels from '../common/addModels';
import SimplifiedTag from './models/SimplifiedTag';
import addLinks from './addLinks';
import addPages from './addPages';
import addProductEdit from './addProductEdit';

export {
    common,
    backoffice,
};

app.initializers.add('flamarkt-taxonomies', () => {
    addModels();

    // The Tags extension doesn't boot in the backoffice frontend, but we need the model+store so we register it ourselves
    if (!app.store.models.tags) {
        app.store.models.tags = SimplifiedTag;
    }

    addPages();
    addLinks();
    addProductEdit();
});
