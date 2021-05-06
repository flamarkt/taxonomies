import UserTaxonomyPage from './components/UserTaxonomyPage';

export default function () {
    app.routes.flamarktTaxonomiesUser = {
        path: '/u/:username/taxonomies',
        component: UserTaxonomyPage,
    };

    app.route.flamarktTaxonomiesUser = user => {
        return app.route('flamarktTaxonomiesUser', {
            username: user.username(),
        });
    };
}
