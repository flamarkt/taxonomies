import {Attributes} from 'mithril';
import app from 'flarum/common/app';
import Link from 'flarum/common/components/Link';
import extract from 'flarum/common/utils/extract';
import Term from '../models/Term';
import taxonomyIcon from './taxonomyIcon';
import Taxonomy from '../models/Taxonomy';

export default function termLabel(term: Taxonomy | Term | null = null, attrs: Attributes = {}) {
    attrs.style = attrs.style || {};
    attrs.className = 'TaxonomyLabel ' + (attrs.className || '');

    const discussionLink = extract(attrs, 'discussionLink');
    const userLink = extract(attrs, 'userLink');
    const tagText = term ? term.name() : app.translator.trans('flarum-tags.lib.deleted_tag_text');
    let tag: any = 'span';

    if (term) {
        const color = term.color();
        if (color) {
            attrs.style.backgroundColor = attrs.style.color = color;
            attrs.className += ' colored';
        }

        // We need to check for instanceof because this method is also used with a taxonomy passed as a value
        if (term instanceof Term && term.taxonomy() && term.taxonomy().canSearch()) {
            if (discussionLink) {
                attrs.title = term.description() || '';
                attrs.href = app.route('index', {[term.taxonomy().slug()]: term.slug()});
                tag = Link;
            }

            // Only generate user taxonomy links if fof/user-directory is enabled
            if (userLink && app.routes.fof_user_directory) {
                attrs.title = term.description() || '';
                attrs.href = app.route('fof_user_directory', {q: 'taxonomy:' + term.taxonomy().slug() + ':' + term.slug()});
                tag = Link;
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
