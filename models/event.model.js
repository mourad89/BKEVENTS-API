const mongoose = require('mongoose');
const { type } = require('os');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const eventSchema = new Schema({
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  eventType: { type: String, required: true },
  eventTime: { type: String, required: true },
  adresse: { type: String, required: true },
  singers: { type: String , required: true},
  image: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: String, required: true},
  duree:{ type: String, required: true},
  questions: [{ type: ObjectId, ref: 'Question' }]
});

module.exports = mongoose.model('Event', eventSchema);
