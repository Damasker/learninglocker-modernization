// @ll-compat-audit: ok 2026-08-01
import { validateIri, validateMailto } from 'lib/kernel/xapiValidation/regex';

export default (identifierType, identifierValue) => {
  switch (identifierType) {
    case 'account': {
      const homePage = identifierValue.get('homePage');
      const name = identifierValue.get('name');
      const hasHomePageErrors = validateIri(homePage, ['homePage']).length !== 0;
      const hasNameErrors = name.length === 0;
      return hasHomePageErrors || hasNameErrors;
    }
    case 'mbox': {
      return validateMailto(identifierValue, ['mbox']).length !== 0;
    }
    case 'mbox_sha1sum': {
      return identifierValue.length === 0;
    }
    case 'openid': {
      return validateIri(identifierValue, ['openid']).length !== 0;
    }
    default: {
      return true;
    }
  }
};
