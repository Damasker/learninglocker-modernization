// @ll-compat-audit: ok 2026-08-01
import { fromJS } from 'immutable';
import firstValuesOf from 'ui/utils/visualisations/helpers/firstValuesOf';

// Combination: I C/D E.
export default ({ projections = {} }) => fromJS([
  {
    $group: {
      _id: '$value',
      ...firstValuesOf(projections),
    },
  },
  {
    $group: {
      _id: null,
      count: {
        $sum: 1,
      },
      ...firstValuesOf(projections),
    },
  },
]);
