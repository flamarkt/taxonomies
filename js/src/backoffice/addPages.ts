import app from 'flamarkt/backoffice/backoffice/app';
import TaxonomiesPage from './components/TaxonomiesPage';
import TaxonomiesRedirectPage from './components/TaxonomiesRedirectPage';

export default function () {
    app.routes.taxonomies = {
        path: '/taxonomies/:resource',
        component: TaxonomiesPage,
    };

    // This was the old route. We keep it and redirect it to the new one in case it was bookmarked
    app.routes.taxonomiesRedirect = {
        path: '/taxonomies',
        component: TaxonomiesRedirectPage,
    };
}
