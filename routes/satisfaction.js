const express = require('express');
const router = express.Router();
const Satisfaction = require('../models/satisfaction.model');

router.post('/', async (req, res) => {
  try {
    const { Name, Date, userRating, improve, navigation, claire, reservationSpeed, eventOntime, eventQuality, noteService, noteStaff, suggestion, permission, UserSatisId } = req.body;
    const satisfaction = new Satisfaction({ Name, Date, userRating, improve, navigation, claire, reservationSpeed, eventOntime, eventQuality, noteService, noteStaff, suggestion, permission, UserSatisId });
    await satisfaction.save();
    res.status(201).json(satisfaction);
  } catch (err) {
    console.error('Error creating satisfaction:', err);
    res.status(500).send('Server Error');
  }
});

router.get('/', async (req, res) => {
  try {
    const satisfactions = await Satisfaction.find();
    res.json(satisfactions);
  } catch (err) {
    console.error('Error getting satisfactions:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
