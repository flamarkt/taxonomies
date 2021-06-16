import Taxonomy from '../../common/models/Taxonomy';

export default function (type: string) {
    return (t: Taxonomy) => t.type() === type && t.canSearch() && t.showFilter();
}
