<?php

namespace Flamarkt\Taxonomies\Extenders;

use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Database\AbstractModel;
use Flarum\Extend\ApiController;
use Flarum\Extend\ApiSerializer;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Flarum\Foundation\ValidationException;
use Flamarkt\Taxonomies\Repositories\TaxonomyRepository;
use Flamarkt\Taxonomies\Api\Serializer\TermSerializer;
use Flamarkt\Taxonomies\Taxonomy;
use Flamarkt\Taxonomies\Term;
use Flarum\Locale\Translator;
use Flarum\User\User;
use FoF\Transliterator\Transliterator;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Validation\Factory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class TaxonomizeModel implements ExtenderInterface
{
    protected $type;
    protected $serializerClass;
    protected $listenSavingCallback;
    protected $validateNonExistingCallback;
    protected $includeInControllers = [];

    /**
     * @param string $type The type value of the taxonomy for this model
     * @param string $serializerClass The ::class of the serializer we connect Terms to
     */
    public function __construct(string $type, string $serializerClass)
    {
        $this->type = $type;
        $this->serializerClass = $serializerClass;
    }

    /**
     * The callback will receive an instance of the event dispatcher and an anonymous function.
     * The function has to be registered as the event handler.
     * The function must receive the model as first parameter, actor as second and data as third.
     * @param callable $callback
     * @return $this
     */
    public function listenSaving(callable $callback): self
    {
        $this->listenSavingCallback = $callback;

        return $this;
    }

    /**
     * Add a ::class controller to the list of controllers that should include the terms by default
     * @param string $controller
     * @return $this
     */
    public function includeInController(string $controller): self
    {
        $this->includeInControllers[] = $controller;

        return $this;
    }

    /**
     * Registers a callback that receives the saving event and determines whether missing terms should be validated
     * @param callable $callback
     * @return $this
     */
    public function validateNonExistingCallback(callable $callback): self
    {
        $this->validateNonExistingCallback = $callback;

        return $this;
    }

    public function extend(Container $container, Extension $extension = null)
    {
        (new ApiSerializer($this->serializerClass))
            ->attributes(function (AbstractSerializer $serializer, $model) {
                if ($serializer->getActor()->cannot('seeTaxonomy', $model)) {
                    $model->setRelation('taxonomyTerms', null);
                }

                return [
                    'canEditTaxonomies' => $serializer->getActor()->can('editTaxonomy', $model),
                ];
            })
            ->hasMany('taxonomyTerms', TermSerializer::class)
            ->extend($container, $extension);

        foreach ($this->includeInControllers as $controller) {
            (new ApiController($controller))
                ->addInclude('taxonomyTerms')
                ->addInclude('taxonomyTerms.taxonomy')
                ->extend($container, $extension);
        }

        if ($this->listenSavingCallback) {
            call_user_func($this->listenSavingCallback, $container['events'], function (AbstractModel $model, User $actor, array $data) {
                $this->saving($model, $actor, $data);
            });
        }
    }

    public function saving(AbstractModel $model, User $actor, array $data)
    {
        /**
         * @var $repository TaxonomyRepository
         */
        $repository = resolve(TaxonomyRepository::class);

        /**
         * @var $validatorFactory Factory
         */
        $validatorFactory = resolve(Factory::class);

        $alreadyValidatedMinimums = [];

        $taxonomiesData = Arr::get($data, 'relationships.taxonomies.data', []);

        if (count($taxonomiesData) && $actor->cannot('editTaxonomy', $model)) {
            throw new ValidationException([], [
                'taxonomyTerms' => resolve(Translator::class)->trans('flamarkt-taxonomies.api.error.cannot_use_taxonomies_on_model'),
            ]);
        }

        $discussionTagIds = collect();

        if ($this->type === 'discussions') {
            // This data is untrusted, but we know flarum-tags will throw permissions error before anything is persisted if those are invalid
            $tagsData = Arr::get($data, 'relationships.tags.data');

            if (is_array($tagsData)) {
                foreach ($tagsData as $tagData) {
                    $discussionTagIds->push(Arr::get($tagData, 'id'));
                }
            } else {
                $tagsCollection = $model->tags;

                // Checking if the result is a collection lets us skip the extension enabled check for now
                // It's done later on when a scope actually needs validation
                if ($tagsCollection instanceof Collection) {
                    $discussionTagIds = $tagsCollection->pluck('id');
                }
            }
        }

        foreach ($taxonomiesData as $taxonomyData) {
            $taxonomy = $repository->findIdOrFail(Arr::get($taxonomyData, 'id'), $this->type);

            $termIds = [];
            $customTerms = [];

            foreach (Arr::get($taxonomyData, 'relationships.terms.data', []) as $termData) {
                $id = Arr::get($termData, 'id');

                if ($id) {
                    $termIds[] = $id;
                } else {
                    $customTerms[] = Arr::get($termData, 'attributes.name');
                }
            }

            // If we are updating a discussion and are setting new terms, check scopes
            // We will skip this if the request is for removing all terms
            if (
                $taxonomy->type === 'discussions' &&
                (count($termIds) > 0 || count($customTerms) > 0) &&
                !$taxonomy->appliesToDiscussion($discussionTagIds)
            ) {
                throw new ValidationException([], [
                    'taxonomyTerms' => resolve(Translator::class)->trans('flamarkt-taxonomies.api.error.discussion_taxonomy_not_in_scope', [
                        'slug' => $taxonomy->slug,
                    ]),
                ]);
            }

            $terms = $taxonomy->terms()->whereIn('id', $termIds)->get();

            $key = 'term_count_' . $taxonomy->slug;
            $rules = ['numeric'];

            if ($actor->cannot('bypassTermCounts', $taxonomy)) {
                if ($taxonomy->min_terms) {
                    $rules[] = 'min:' . $taxonomy->min_terms;
                }

                if ($taxonomy->max_terms) {
                    $rules[] = 'max:' . $taxonomy->max_terms;
                }
            }

            $validator = $validatorFactory->make(
                [$key => $terms->count() + count($customTerms)],
                [$key => $rules]
            );

            if ($validator->fails()) {
                throw new ValidationException([], ['taxonomyTerms' => $validator->getMessageBag()->first($key)]);
            }

            $alreadyValidatedMinimums[] = $taxonomy->id;

            foreach ($customTerms as $customTerm) {
                $key = 'term_name_' . $taxonomy->slug;

                $validation = 'string';

                if (in_array($taxonomy->custom_value_validation, ['alpha_num', 'alpha_dash'])) {
                    $validation = $taxonomy->custom_value_validation;
                }

                if (Str::startsWith($taxonomy->custom_value_validation, '/')) {
                    $validation = 'regex:' . $taxonomy->custom_value_validation;
                }

                $validator = $validatorFactory->make(
                    [$key => $customTerm],
                    [$key => $validation]
                );

                if ($validator->fails()) {
                    throw new ValidationException([], ['taxonomyTerms' => $validator->getMessageBag()->first($key)]);
                }
            }

            $newTermIds = $terms->pluck('id')->all();

            foreach ($customTerms as $customTerm) {
                /**
                 * @var $existingTermWithSameName Term
                 */
                $existingTermWithSameName = $taxonomy->terms()->where('name', $customTerm)->first();

                // It's possible somebody else created a term with the same name in the meantime
                // If that's the case, we re-use the existing term
                // This also prevents malicious creation of the exact same term multiple times
                if ($existingTermWithSameName) {
                    $newTermIds[] = $existingTermWithSameName->id;

                    continue;
                }

                $slug = null;

                switch ($taxonomy->custom_value_slugger) {
                    case 'alpha_dash':
                        $slug = Str::slug($customTerm);
                        break;
                    case 'transliterator':
                        if (!class_exists(Transliterator::class)) {
                            throw new \Exception('You need to install the FriendsOfFlarum Transliterator extension for this option');
                        }
                        $slug = Transliterator::transliterate($customTerm);
                        break;
                    // case random
                    default:
                        $slug = Str::random();
                }

                $suffix = '';

                // Try to find a unique slug by using an incremental suffix if necessary
                while (true) {
                    $testSlug = $slug . $suffix;

                    if (!$taxonomy->terms()->where('slug', $testSlug)->exists()) {
                        break;
                    }

                    $suffix = !$suffix ? 2 : ($suffix + 1);
                }

                $term = new Term();
                $term->taxonomy()->associate($taxonomy);
                $term->name = $customTerm;
                $term->slug = $slug . $suffix;
                $term->save();

                $newTermIds[] = $term->id;
            }

            $model->afterSave(function (AbstractModel $model) use ($taxonomy, $newTermIds) {
                // Implementation similar to $relationship->sync(), but taxonomy-aware

                $currentTermIds = $model->taxonomyTerms()->where('taxonomy_id', $taxonomy->id)->pluck('id')->all();

                $detach = array_diff($currentTermIds, $newTermIds);
                if (count($detach) > 0) {
                    $model->taxonomyTerms()->detach($detach);
                }

                $attach = array_diff($newTermIds, $currentTermIds);
                if (count($attach) > 0) {
                    $model->taxonomyTerms()->attach($attach);
                }
            });
        }

        // Enforce min_terms for taxonomies that were omitted from payload
        if (
            $this->validateNonExistingCallback &&
            call_user_func($this->validateNonExistingCallback, $model, $actor) &&
            $actor->can('editTaxonomy', $model)
        ) {
            /**
             * @var Taxonomy[] $omittedTaxonomiesWithRequiredMinimums
             */
            $omittedTaxonomiesWithRequiredMinimums = Taxonomy::query()
                ->where('type', $this->type)
                ->whereNotIn('id', $alreadyValidatedMinimums)
                ->where('min_terms', '>', 0)
                ->get();

            foreach ($omittedTaxonomiesWithRequiredMinimums as $taxonomy) {
                if ($this->type === 'discussions' && !$taxonomy->appliesToDiscussion($discussionTagIds)) {
                    continue;
                }

                if ($actor->can('bypassTermCounts', $taxonomy)) {
                    continue;
                }

                $key = 'term_count_' . $taxonomy->slug;

                $validator = $validatorFactory->make(
                    [$key => 0],
                    [$key => ['numeric', 'min:' . $taxonomy->min_terms]]
                );

                if ($validator->fails()) {
                    throw new ValidationException([], ['taxonomyTerms' => $validator->getMessageBag()->first($key)]);
                }
            }
        }
    }
}
