import Taxonomy from '../../common/models/Taxonomy';

/**
 * Checks if filters should be made available.
 * There are 2 different levels:
 * "alsoParamOnly" just checks whether the filter should be made available via the URL.
 * (default) checks whether the filter should be shown in the UI to the user.
 * @param type
 * @param alsoParamOnly
 */
export default function (type: string, alsoParamOnly: boolean = false) {
    return (t: Taxonomy) => t.type() === type && t.canSearch() && (t.showFilter() || alsoParamOnly);
}
