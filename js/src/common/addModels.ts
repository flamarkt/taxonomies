import app from 'flarum/common/app';
import Discussion from 'flarum/common/models/Discussion';
import Forum from 'flarum/common/models/Forum';
import User from 'flarum/common/models/User';
import Model from 'flarum/common/Model';
import Product from 'flamarkt/core/common/models/Product';
import Taxonomy from './models/Taxonomy';
import Term from './models/Term';

export default function () {
    app.store.models['flamarkt-taxonomies'] = Taxonomy;
    app.store.models['flamarkt-taxonomy-terms'] = Term;

    Forum.prototype.taxonomies = Model.hasMany('taxonomies');
    Discussion.prototype.taxonomyTerms = Model.hasMany('taxonomyTerms');
    User.prototype.taxonomyTerms = Model.hasMany('taxonomyTerms');

    if (Product) {
        Product.prototype.taxonomyTerms = Model.hasMany('taxonomyTerms');
    }
}
