const express = require('express');
const router = express.Router();
const Achat = require('../models/achat.model');
const Event = require('../models/event.model');
const User = require('../models/User');
const transporter = require('../emailTransporter');
const bodyParser = require('body-parser');

const stripe = require('stripe')('sk_test_51PEJzZCu2nwSKN2MUMasSuTNsvgbnAn6sn85viATqKsotT0ZEnqx8iJWKSew8LIC9KyEw5VMDrWgwIxzlrLLP1BW00M2gW2SBC');
router.use(bodyParser.json());

router.post('/', async (req, res, next) => {
  try {
    const { userId, items } = req.body;
    if (!userId || !items || !items.length) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: "http://localhost:3001/public/success.html",
      cancel_url: "http://localhost:3001/public/cancel.html",
      metadata: {
        userId: userId,
        items: JSON.stringify(items)
      }
    });

    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
});

router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookKey = 'whsec_uZEazSALeoxqDiDhdRlEZA7ywHnoB0T7';

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookKey);

  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const { userId, items } = session.metadata;
    const parsedItems = JSON.parse(items);

    for (const item of parsedItems) {
      const eventId = item.id;
      const quantity = item.quantity;
      const totalAmount = item.price * item.quantity;

      const newAchat = new Achat({
        userId,
        eventId,
        quantity,
        total: totalAmount,
      });

      await newAchat.save();

      const event = await Event.findById(eventId);
      const user = await User.findById(userId);

      const mailOptions = {
        from: 'mourad.habboul@gmail.com',
        to: user.email,
        subject: 'Confirmation d\'achat',
        text: `Bonjour Mr/Mme ${user.nom},\n Merci d'avoir acheté ${item.quantity} billet(s) pour l'événement ${event.eventName}.\n
        adresse: ${event.adresse}\n
        date: ${event.eventDate} à ${event.eventTime}\n\n
        Cordialement, Votre équipe BKevents`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
        } else {
          console.log('E-mail envoyé:', info.response);
        }
      });
    }
  }

  res.status(200).json({ received: true });
});

module.exports = router;
