// @ll-compat-audit: ok 2026-08-01
import {
  renameCuratrDashboardsToStream,
  renameStreamDashboardsToCuratr
} from 'cli/commands/migrateCuratrDashboardsToStream';


const up = async () => {
  await renameCuratrDashboardsToStream();
};

const down = async () => {
  await renameStreamDashboardsToCuratr();
};

export default { up, down };
