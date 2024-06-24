const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const achatSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  total: { type: Number, required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const Achat = mongoose.model('Achat', achatSchema);

module.exports = Achat;
