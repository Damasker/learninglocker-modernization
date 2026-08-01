// @ll-compat-audit: ok 2026-08-01
import firstValuesOf from 'ui/utils/visualisations/helpers/firstValuesOf';

// Combination: A/B C F.
export default ({ operator, projections = {} }) => [
  {
    $group: {
      _id: '$group',
      count: {
        [operator]: '$value',
      },
      ...firstValuesOf(projections),
    },
  },
];
