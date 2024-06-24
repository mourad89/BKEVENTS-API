const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const transporter = require('../emailTransporter');
const emailExistence = require('email-existence');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Code = require('../models/code.model');


function code(length) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomCode = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomCode += charset.charAt(randomIndex);
  }

  return randomCode;
}

const sendNotificationEmail = (userData) => {
  const mailOptions = {
    from: 'mourad.habboul@gmail.com',
    to: 'mourad.habboul@gmail.com',
    subject: 'Nouvel utilisateur enregistré',
    text: `Un nouvel utilisateur a été enregistré : ${userData.nom} ${userData.prenom} (${userData.email})`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail de notification :', error);
    } else {
      console.log('E-mail de notification envoyé :', info.response);
    }
  });
};


router.post('/register', async (req, res) => {
  try {
    const { nom, prenom, email, phone, pwd, ville, sexe, role, date_naissance } = req.body;

    emailExistence.check(email, async (err, isValid) => {
      if (err) {
        console.error('Erreur lors de la vérification de l\'adresse e-mail :', err);
        return res.status(500).json({ message: 'Une erreur est survenue lors de la vérification de l\'adresse e-mail.' });
      }

      if (!isValid) {
        console.log('adresse e-mail est invalide.');
        return res.status(400).json({ message: 'adresse e-mail est invalide.' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('e-mail est deja utilisé.');
        return res.status(400).json({ message: 'adresse e-mail est deja utilisé.' });
      }

      const hashedPwd = await bcrypt.hash(pwd, 10);

      const newUser = new User({
        nom,
        prenom,
        email,
        phone,
        pwd: hashedPwd,
        ville,
        sexe,
        role,
        date_naissance,
        isEmailVerified: true
      });

      await newUser.save();

      sendNotificationEmail(newUser);
      const mailOptions = {
        from: 'mourad.habboul@gmail.com',
        to: email,
        subject: 'Confirmation d\'inscription',
        text: `Bonjour , ${prenom} \n

        Nous sommes ravis de vous accueillir parmi nous \! Votre inscription a été réalisée avec succès et vous faites désormais partie de notre communauté. \n

        Pour commencer, nous vous invitons à explorer les fonctionnalités de notre plateforme.\n


        Si vous avez des questions ou avez besoin d\'assistance, notre équipe de support est à votre disposition. N\'hésitez pas à nous contacter. \n

        Encore une fois, bienvenue et nous espérons que vous apprécierez votre expérience sur notre plateforme \! \n

        Cordialement,

        L\'équipe BKEVENTS`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Erreur lors de l\'envoi de l\'e-mail de confirmation :', error);
          res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'e-mail de confirmation.' });
        } else {
          console.log('E-mail de confirmation envoyé :', info.response);
          res.status(201).json({ message: 'Inscription réussie.' });
        }
      });
    });
  } catch (error) {
    console.error('Erreur d\'inscription :', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de l\'inscription.' });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { email, pwd } = req.body;

const user = await User.findOne({ email });

if (!user) {
  return res.status(401).json({ success: false, message: 'Aucun compte associé a cette email.' });
}

if (!user.pwd) {
  return res.status(401).json({ success: false, message: 'Mot de passe non défini pour cet utilisateur.' });
}

const isMatch = await bcrypt.compare(pwd, user.pwd);
if (!isMatch) {
  return res.status(401).json({ success: false, message: 'mot de passe incorrecte.' });
}


    res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.error('Erreur de connexion :', error);
    res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la connexion.' });
  }


});

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des utilisateurs.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'ID d\'utilisateur invalide.' });
    }

    const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la mise à jour de l\'utilisateur.' });
  }
});



router.get('/search', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
  } catch (error) {
    console.error('Erreur lors de la recherche de l\'utilisateur :', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la recherche de l\'utilisateur.' });
  }
});

router.get('/users/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur par email :', error);
    res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la récupération de l\'utilisateur.' });
  }
});


router.put('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
    res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la mise à jour de l\'utilisateur.' });
  }
});

router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    res.status(200).json({ success: true, message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur :', error);
    res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la suppression de l\'utilisateur.' });
  }
});

router.put('/newpwd/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldPwd, newPwd } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    const isMatch = await bcrypt.compare(oldPwd, user.pwd);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Ancien mot de passe incorrect.' });
    }

    const hashedPwd = await bcrypt.hash(newPwd, 10);
    user.pwd = hashedPwd;
    await user.save();

    res.status(200).json({ success: true, message: 'Mot de passe mis à jour avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe :', error);
    res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la mise à jour du mot de passe.' });
  }
});

router.post('/sendMail', async (req, res) => {
  const { email } = req.body;
  const verifCode = code(6);
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  const newCode = new Code({
    email,
    code: verifCode,
    expiration,
  });
  let mailOptions = {
    from: 'mourad.habboul@gmail.com',
    to: email,
    subject: 'reinisialisation de mot de passe',
    text: `cliquer sur le lien pour reinitialisez votre mot de passe :
    Cliquer ici <a href="http://localhost:4200/resetpwd?code=${verifCode}"> pour terminer la reinitialisation de mot de passe.
    CODE = ${verifCode}`
  };

  try {
    await newCode.save();
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    res.status(200).json({ success: true, message: 'Email sent successfully.' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ success: false, message: 'Error sending email.' });
  }
});
router.post('/checkMail', async(req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Erreur du serveur.' });
  }
});

router.post('/reset', async (req, res) => {
  const { email, code, newPwd } = req.body;

  try {
    const verifCode = await Code.findOne({ code });
    if (!verifCode) {
      return res.status(400).json({ success: false, message: 'Code invalide' });
    }
    if (email !== verifCode.email) {
      return res.status(400).json({ success: false, message: 'Vous n\'avez pas encore une code de verification' });
    }

    if (new Date() > verifCode.expiration) {
      return res.status(400).json({ success: false, message: 'Code de vérification expiré.' });
    }

    const hashedPwd = await bcrypt.hash(newPwd, 10);

    const user = await User.findOneAndUpdate(
      { email: email },
      { $set: { pwd: hashedPwd } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    console.log(email, newPwd);
    res.status(200).json({ success: true, message: 'Mot de passe mis à jour avec succès.' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du mot de passe.' });
  }
});


module.exports = router;
