// @ll-compat-audit: ok 2026-08-01
import {
  validateMailto,
  validateIri,
  validateSha1,
} from 'lib/kernel/xapiValidation/regex';
import { restrictToSchema, required, checkType, maybe, restrictToCollection } from 'rulr';

export const validateIfi = (ifi, path) => {
  const valuePath = [...path, 'value'];
  if (ifi.key === 'mbox') {
    return validateMailto(ifi.value, valuePath);
  }
  if (ifi.key === 'mbox_sha1sum') {
    return validateSha1(ifi.value, valuePath);
  }
  if (ifi.key === 'openid') {
    return validateIri(ifi.value, valuePath);
  }
  if (ifi.key === 'account') {
    return restrictToSchema({
      homePage: required(validateIri),
      name: required(checkType(String))
    })(ifi.value, valuePath);
  }
  return ['invalid key'];
};

export const validateIfis = maybe(restrictToCollection(() => validateIfi));

export default maybe(validateIfi);
