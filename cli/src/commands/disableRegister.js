// @ll-compat-audit: ok 2026-08-01
import mongoose from 'mongoose';
import SiteSettings from 'lib/models/siteSettings';
import { SITE_SETTINGS_ID } from 'lib/constants/siteSettings';

const objectId = mongoose.Types.ObjectId;

export default async function () {
  await SiteSettings.updateOne({
    _id: objectId(SITE_SETTINGS_ID)
  }, {
    dontShowRegistration: true
  }, {
    upsert: true
  }).exec();

  process.exit();
}
