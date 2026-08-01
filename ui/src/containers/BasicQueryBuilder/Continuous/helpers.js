/**
 * @param {string} symbolOp - "<", ">", "<=", or ">="
 * @returns {string} - mongodb's comparison query operator
 */
// @ll-compat-audit: ok 2026-08-01
export const symbolOpToMongoOp = (symbolOp) => {
  switch (symbolOp) {
    case '>': return '$gt';
    case '>=': return '$gte';
    case '<=': return '$lte';
    case '<':
    default: return '$lt';
  }
};

export default {};
