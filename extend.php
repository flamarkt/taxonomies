<?php

namespace Flamarkt\Taxonomies;

use Flamarkt\Core\Api\Controller as FlamarktController;
use Flamarkt\Core\Api\Serializer\ProductSerializer;
use Flamarkt\Core\Product\Event\Saving as ProductSaving;
use Flamarkt\Core\Product\Product;
use Flamarkt\Core\Product\ProductFilterer;
use Flamarkt\Core\Product\ProductSearcher;
use Flarum\Api\Controller;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Api\Serializer\UserSerializer;
use Flarum\Discussion\Discussion;
use Flarum\Discussion\Event\Saving as DiscussionSaving;
use Flarum\Discussion\Filter\DiscussionFilterer;
use Flarum\Discussion\Search\DiscussionSearcher;
use Flarum\Extend;
use Flarum\User\Event\Saving as UserSaving;
use Flarum\User\Filter\UserFilterer;
use Flarum\User\Search\UserSearcher;
use Flarum\User\User;
use Illuminate\Contracts\Events\Dispatcher;

return [
    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    // Intentionally registering admin code on both frontends, because it holds the configuration for the extension page
    (new Extend\Frontend('backoffice'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    (new Extend\Frontend('backoffice'))
        ->js(__DIR__ . '/js/dist/backoffice.js')
        ->css(__DIR__ . '/resources/less/backoffice.less')
        ->route('/taxonomies', 'taxonomies.index'),

    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/resources/less/forum.less'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\Routes('api'))
        ->post('/flamarkt/taxonomies/order', 'flamarkt-taxonomies.taxonomies.order', Api\Controller\TaxonomyOrderController::class)
        ->get('/flamarkt/taxonomies', 'flamarkt-taxonomies.taxonomies.index', Api\Controller\TaxonomyIndexController::class)
        ->post('/flamarkt/taxonomies', 'flamarkt-taxonomies.taxonomies.store', Api\Controller\TaxonomyStoreController::class)
        ->patch('/flamarkt/taxonomies/{id:[0-9]+}', 'flamarkt-taxonomies.taxonomies.update', Api\Controller\TaxonomyUpdateController::class)
        ->delete('/flamarkt/taxonomies/{id:[0-9]+}', 'flamarkt-taxonomies.taxonomies.delete', Api\Controller\TaxonomyDeleteController::class)
        ->get('/flamarkt/taxonomies/{id:[0-9]+}/terms', 'flamarkt-taxonomies.terms.index', Api\Controller\TermIndexController::class)
        ->post('/flamarkt/taxonomies/{id:[0-9]+}/terms', 'flamarkt-taxonomies.terms.store', Api\Controller\TermStoreController::class)
        ->post('/flamarkt/taxonomies/{id:[0-9]+}/terms/order', 'flamarkt-taxonomies.terms.order', Api\Controller\TermOrderController::class)
        ->patch('/flamarkt/taxonomy-terms/{id:[0-9]+}', 'flamarkt-taxonomies.terms.update', Api\Controller\TermUpdateController::class)
        ->delete('/flamarkt/taxonomy-terms/{id:[0-9]+}', 'flamarkt-taxonomies.terms.delete', Api\Controller\TermDeleteController::class),

    (new Extend\Policy())
        ->modelPolicy(Discussion::class, Access\DiscussionPolicy::class)
        ->modelPolicy(Product::class, Access\ProductPolicy::class)
        ->modelPolicy(Taxonomy::class, Access\TaxonomyPolicy::class)
        ->modelPolicy(User::class, Access\UserPolicy::class),

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->hasMany('taxonomies', Api\Serializer\TaxonomySerializer::class),

    (new Extend\ApiController(Controller\ShowForumController::class))
        ->addInclude('taxonomies')
        ->prepareDataForSerialization(LoadForumTaxonomiesRelationship::class),

    (new Extend\Model(Discussion::class))
        ->relationship('taxonomyTerms', function (Discussion $discussion) {
            return $discussion
                ->belongsToMany(Term::class, 'flamarkt_discussion_taxonomy_term', 'discussion_id', 'term_id')
                ->withTimestamps();
        }),
    (new Extend\Model(User::class))
        ->relationship('taxonomyTerms', function (User $user) {
            return $user
                ->belongsToMany(Term::class, 'flamarkt_taxonomy_term_user', 'user_id', 'term_id')
                ->withTimestamps();
        }),
    (new Extend\Model(Product::class))
        ->relationship('taxonomyTerms', function (Product $product) {
            return $product
                ->belongsToMany(Term::class, 'flamarkt_product_taxonomy_term', 'product_id', 'term_id')
                ->withTimestamps();
        }),

    (new Extend\Middleware('api'))
        ->add(Middlewares\NestedArrayFilterToJSON::class),

    (new Extend\Middleware('forum'))
        ->add(Middlewares\StickyIndexParams::class),

    (new Extenders\TaxonomizeModel(
        'discussions',
        DiscussionSerializer::class
    ))
        ->listenSaving(function (Dispatcher $dispatcher, callable $handle) {
            $dispatcher->listen(DiscussionSaving::class, function (DiscussionSaving $event) use ($handle) {
                $handle($event->discussion, $event->actor, $event->data);
            });
        })
        ->includeInController(Controller\ListDiscussionsController::class)
        ->includeInController(Controller\ShowDiscussionController::class)
        ->includeInController(Controller\CreateDiscussionController::class)
        ->includeInController(Controller\UpdateDiscussionController::class)
        ->validateNonExistingCallback(function (Discussion $discussion, User $actor) {
            return !$discussion->exists && $actor->hasPermission('discussion.editOwnTaxonomy');
        }),

    (new Extenders\TaxonomizeModel(
        'users',
        UserSerializer::class
    ))
        ->listenSaving(function (Dispatcher $dispatcher, callable $handle) {
            $dispatcher->listen(UserSaving::class, function (UserSaving $event) use ($handle) {
                $handle($event->user, $event->actor, $event->data);
            });
        })
        ->includeInController(Controller\ListUsersController::class)
        ->includeInController(Controller\ShowUserController::class)
        ->includeInController(Controller\CreateUserController::class)
        ->includeInController(Controller\UpdateUserController::class),

    (new Extenders\TaxonomizeModel(
        'products',
        ProductSerializer::class
    ))
        ->listenSaving(function (Dispatcher $dispatcher, callable $handle) {
            $dispatcher->listen(ProductSaving::class, function (ProductSaving $event) use ($handle) {
                $handle($event->product, $event->actor, $event->data);
            });
        })
        ->includeInController(FlamarktController\ProductIndexController::class)
        ->includeInController(FlamarktController\ProductShowController::class)
        ->includeInController(FlamarktController\ProductStoreController::class)
        ->includeInController(FlamarktController\ProductUpdateController::class),

    (new Extend\Filter(DiscussionFilterer::class))
        ->addFilter(Gambits\DiscussionTaxonomyGambit::class),
    (new Extend\SimpleFlarumSearch(DiscussionSearcher::class))
        ->addGambit(Gambits\DiscussionTaxonomyGambit::class),

    (new Extend\Filter(UserFilterer::class))
        ->addFilter(Gambits\UserTaxonomyGambit::class),
    (new Extend\SimpleFlarumSearch(UserSearcher::class))
        ->addGambit(Gambits\UserTaxonomyGambit::class),

    (new Extend\Filter(ProductFilterer::class))
        ->addFilter(Gambits\ProductTaxonomyGambit::class),
    (new Extend\SimpleFlarumSearch(ProductSearcher::class))
        ->addGambit(Gambits\ProductTaxonomyGambit::class),

    (new Extend\ErrorHandling())
        ->handler(Exceptions\InvalidFilterTaxonomy::class, Exceptions\InvalidFilterTaxonomyHandler::class),
];
