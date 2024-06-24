const express = require('express');
const router = express.Router();
const Question = require('../models/question.model');

router.post('/', async (req, res) => {
  try {
    const { questionText } = req.body;
    const question = new Question({ questionText });
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    console.error('Error creating question:', err);
    res.status(500).send('Server Error');
  }
});

router.get('/', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    console.error('Error getting questions:', err);
    res.status(500).send('Server Error');
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { questionText } = req.body;
    const question = await Question.findByIdAndUpdate(id, { questionText }, { new: true });
    res.json(question);
  } catch (err) {
    console.error('Error updating question:', err);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Question.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting question:', err);
    res.status(500).send('Server Error');
  }
});



module.exports = router;
