/**
 * build $dateToString expression from format and timezone
 *
 * https://docs.mongodb.com/manual/reference/operator/aggregation/dateToString/
 *
 * @param {string} format
 * @param {string} timezone
 * @returns object
 */
// @ll-compat-audit: ok 2026-08-01
export default (format, timezone) => ({
  $dateToString: {
    date: '$timestamp',
    format,
    timezone,
  },
});
