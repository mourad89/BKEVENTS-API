const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const satisfactionSchema = new Schema({
  Name: {
    type: String
  },
  Date: {
    type: Date
  },
  userRating: {
    type: Number
  },
  improve: {
    type: String
  },
  navigation: {
    type: Number
  },
  claire: {
    type: Number
  },
  reservationSpeed: {
    type: Number
  },
  eventOntime: {
    type: String
  },
  eventQuality: {
    type: Number
  },
  noteService: {
    type: Number
  },
  noteStaff: {
    type: Number
  },
  suggestion: {
    type: String
  },
  permission: {
    type: String
  },
  UserSatisId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { collection: 'satisfactions' });

const Satisfaction = mongoose.model('Satisfaction', satisfactionSchema);
module.exports = Satisfaction;





