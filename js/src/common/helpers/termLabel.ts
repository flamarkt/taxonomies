import extract from 'flarum/common/utils/extract';
import Term from '../models/Term';
import taxonomyIcon from './taxonomyIcon';
import Taxonomy from '../models/Taxonomy';
import {Attributes} from 'mithril';

export default function termLabel(term: Taxonomy | Term | null = null, attrs: Attributes = {}) {
    attrs.style = attrs.style || {};
    attrs.className = 'TaxonomyLabel ' + (attrs.className || '');

    const discussionLink = extract(attrs, 'discussionLink');
    const userLink = extract(attrs, 'userLink');
    const tagText = term ? term.name() : app.translator.trans('flarum-tags.lib.deleted_tag_text');
    let tag = 'span';

    if (term) {
        const color = term.color();
        if (color) {
            attrs.style.backgroundColor = attrs.style.color = color;
            attrs.className += ' colored';
        }

        // We need to check for instanceof because this method is also used with a taxonomy passed as a value
        if (term instanceof Term && term.taxonomy() && term.taxonomy().showFilter()) {
            if (discussionLink) {
                attrs.title = term.description() || '';
                attrs.href = app.route('index', {[term.taxonomy().slug()]: term.slug()});
                attrs.config = m.route;
                tag = 'a';
            }

            // Only generate user taxonomy links if fof/user-directory is enabled
            if (userLink && app.routes.fof_user_directory) {
                attrs.title = term.description() || '';
                attrs.href = app.route('fof_user_directory', {q: 'taxonomy:' + term.taxonomy().slug() + ':' + term.slug()});
                attrs.config = m.route;
                tag = 'a';
            }
        }
    } else {
        attrs.className += ' untagged';
    }

    return m(tag, attrs, m('span.TaxonomyLabel-text', [
        term && term.icon() && taxonomyIcon(term, {}, {useColor: false}),
        ' ' + tagText,
    ]));
}
