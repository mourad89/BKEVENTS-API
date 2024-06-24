const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  rating: Number
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
