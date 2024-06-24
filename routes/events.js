const express = require('express');
const router = express.Router();
const Event = require('../models/event.model');
const upload = require('../middleware/upload');
const fs = require('fs');


router.post('/create', upload.single('image'), (req, res) => {
  const eventData = req.body;

  const newEvent = new Event({
    eventName: eventData.eventName,
    eventDate: new Date(eventData.eventDate),
    eventType: eventData.eventType,
    eventTime: eventData.eventTime,
    adresse: eventData.adresse,
    singers: eventData.singers,
    image: req.file.path,
    location: eventData.location,
    price: eventData.price,
    duree: eventData.duree
  });

  newEvent.save()
    .then(() => res.status(201).json({ message: 'Événement créé avec succès' }))
    .catch(err => res.status(500).json({ error: err.message }));
});


router.get('/', (req, res) => {
  Event.find()
    .then(events => res.status(200).json(events))
    .catch(err => res.status(500).json({ error: err.message }));
});

router.delete('/:id', async (req, res) => {
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Événement non trouvé" });
    }

    const imagePath = event.image;
    try {
      fs.unlinkSync(imagePath);
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'image:', err);
    }

    await Event.findByIdAndDelete(eventId);
    res.status(204).send();
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'événement:', err);
    res.status(500).json({ error: err.message });
  }
});



router.put('/:id', (req, res) => {
  const eventId = req.params.id;
  const eventData = req.body;

  Event.findByIdAndUpdate(eventId, eventData, { new: true })
    .then(updatedEvent => res.status(200).json(updatedEvent))
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/:eventId/addQuestions', async (req, res) => {
  const { eventId } = req.params;
  const { questionIds } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'événement non trouvé.' });
    }
    console.log(questionIds);
    event.questions.push(...questionIds);
    await event.save();

    res.status(200).json({ message: 'Questions ajoutés avec succée' });
  } catch (err) {
    console.error('erreur lors l\'ajout des questions:', err);
    res.status(500).json({ error: 'erreur serveur' });
  }
});


module.exports = router;
