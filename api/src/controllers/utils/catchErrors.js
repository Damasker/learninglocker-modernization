// @ll-compat-audit: ok 2026-08-01
import handleRequestError from 'api/controllers/utils/handleRequestError';

const catchErrors = handler => async (req, res) => {
  try {
    await handler(req, res);
  } catch (err) {
    return handleRequestError(res, err);
  }
};

export default catchErrors;
