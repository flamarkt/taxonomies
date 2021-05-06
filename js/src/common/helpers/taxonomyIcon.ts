import classList from 'flarum/common/utils/classList';
import Term from '../models/Term';
import Taxonomy from '../models/Taxonomy';
import {Attributes} from 'mithril';

interface Settings {
    useColor?: boolean
}

export default function taxonomyIcon(term: Taxonomy | Term, attrs: Attributes = {}, settings: Settings = {}) {
    const hasIcon = term && term.icon();
    const {useColor = true} = settings;

    attrs.className = classList([
        attrs.className,
        'icon',
        hasIcon ? term.icon() : 'TaxonomyIcon',
    ]);

    if (term) {
        attrs.style = attrs.style || {};

        if (hasIcon) {
            attrs.style.color = useColor ? term.color() : '';
        } else {
            attrs.style.backgroundColor = term.color();
        }
    } else {
        attrs.className += ' untagged';
    }

    return hasIcon ? m('i', attrs) : m('span', attrs);
}
