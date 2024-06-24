const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  created: { type: Date, default: Date.now },
  expiration: { type: Date, required: true },
});

const Code = mongoose.model('Code', codeSchema);

module.exports = Code;
