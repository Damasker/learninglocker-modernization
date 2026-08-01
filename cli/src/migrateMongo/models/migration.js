// @ll-compat-audit: ok 2026-08-01
import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { getConnection } from 'lib/connections/mongoose';

const schema = new mongoose.Schema({
  key: String,
  upFn: String,
  order: Number
});

schema.plugin(timestamps);

const Migration = getConnection().model('Migration', schema, 'migrations');

export default Migration;
