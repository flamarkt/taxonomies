import ChooseTaxonomyTermsDropdown from './components/ChooseTaxonomyTermsDropdown';
import ChooseTaxonomyTermsModal from './components/ChooseTaxonomyTermsModal';
import labelsFromMultipleTaxonomiesList from './helpers/labelsFromMultipleTaxonomiesList';
import taxonomyIcon from './helpers/taxonomyIcon';
import termLabel from './helpers/termLabel';
import termsLabel from './helpers/termsLabel';
import Taxonomy from './models/Taxonomy';
import Term from './models/Term';
import retrieveTerms from './utils/retrieveTerms';
import sortTaxonomies from './utils/sortTaxonomies';
import sortTerms from './utils/sortTerms';
import termToIdentifier from './utils/termToIdentifier';

export const common = {
    'components/ChooseTaxonomyTermsDropdown': ChooseTaxonomyTermsDropdown,
    'components/ChooseTaxonomyTermsModal': ChooseTaxonomyTermsModal,
    'helpers/labelsFromMultipleTaxonomiesList': labelsFromMultipleTaxonomiesList,
    'helpers/taxonomyIcon': taxonomyIcon,
    'helpers/termLabel': termLabel,
    'helpers/termsLabel': termsLabel,
    'models/Taxonomy': Taxonomy,
    'models/Term': Term,
    'utils/retrieveTerms': retrieveTerms,
    'utils/sortTaxonomies': sortTaxonomies,
    'utils/sortTerms': sortTerms,
    'utils/termToIdentifier': termToIdentifier,
}
