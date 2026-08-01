// @ll-compat-audit: ok 2026-08-01
import {
  removeTemplateIdAndTemplateStage,
  addTemplateIdAndTemplateStage,
} from '../migrateVizTypesOfTemplates';

const up = async () => {
  await removeTemplateIdAndTemplateStage();
};

const down = async () => {
  await addTemplateIdAndTemplateStage();
};

export default { up, down };
