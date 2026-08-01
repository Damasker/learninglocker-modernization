// @ll-compat-audit: ok 2026-08-01
import {
  renameCuratrTemplateTypesToStream,
  renameStreamTemplateTypesToCuratr
} from 'cli/commands/migrateCuratrVisualisationTemplateTypesToStream';

const up = async () => {
  await renameCuratrTemplateTypesToStream();
};

const down = async () => {
  await renameStreamTemplateTypesToCuratr();
};

export default { up, down };
