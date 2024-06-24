const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new mongoose.Schema({
  nom: { type: String, required: true, maxLength: 50 },
  prenom: { type: String, required: true, maxLength: 50 },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  pwd: { type: String, required: true },
  ville: { type: String, required: true },
  sexe: { type: String, enum: ['Homme', 'Femme'], default: 'Homme' },
  role: { type: String, enum: ['User', 'admin'], default: 'User' },
  date_naissance: { type: Date, required: true}


});

const User = mongoose.model('User', userSchema);

module.exports = User;
