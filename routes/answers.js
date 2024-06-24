const express = require('express');
const router = express.Router();
const Answer = require('../models/answer.model');

router.post('/', async (req, res) => {
  const { eventId, userId, questionId, rating } = req.body;

  try {
    const newAnswer = new Answer({
      eventId,
      userId,
      questionId,
      rating
    });
    console.log('Valeurs de réponse:', userId, eventId, questionId, rating);


    await newAnswer.save();
    res.status(201).send({ message: 'réponse enregistrer avec succée.' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'erreur d\'ajout de réponse.' });
  }
});

router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const userAnswers = await Answer.find({ userId });
    res.status(200).send(userAnswers);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'échec de la récupération des réponses d\'utilisateur.' });
  }
});

module.exports = router;
