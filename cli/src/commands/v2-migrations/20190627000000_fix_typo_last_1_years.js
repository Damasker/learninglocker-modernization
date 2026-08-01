// @ll-compat-audit: ok 2026-08-01
import { fix, back } from '../fixTypoLast1Years';

const up = async () => {
  await fix();
};

const down = async () => {
  await back();
};

export default { up, down };
