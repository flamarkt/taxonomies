const config = require('flarum-webpack-config')();

config.entry = {
    admin: './admin.js',
    backoffice: './backoffice.js',
    forum: './forum.js',
};

config.externals.push(function (context, request, callback) {
    let matches;
    if ((matches = /^(flamarkt\/[^/]+)\/([^/]+)\/(.+)$/.exec(request))) {
        return callback(null, 'root flarum.extensions[\'' + matches[1].replace('/', '-') + '\'][\'' + matches[2] + '\'][\'' + matches[3] + '\']');
    }
    callback();
});


// Enable Typescript same way as Flarum Core
config.resolve = {
    extensions: ['.ts', '.tsx', '.js', '.json'],
}
config.module.rules[0].test = /\.(tsx?|js)$/;
config.module.rules[0].use.options.presets.push('@babel/preset-typescript');

module.exports = config;
