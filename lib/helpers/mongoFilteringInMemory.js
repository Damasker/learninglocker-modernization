/* eslint-disable no-use-before-define */
// @ll-compat-audit: ok 2026-08-01
import sift from 'sift';

sift.use({
  $comment: () => true
});

const match = filter => actual => sift(filter, [actual]).length > 0;

export default match;
