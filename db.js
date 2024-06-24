const mongoose = require('mongoose');

const DB_URI = 'mongodb://localhost:27017/bkevents';

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch(err => console.error('Erreur de connexion à MongoDB :', err));

module.exports = mongoose.connection;
