const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');
const questionsRouter = require('./routes/questions');
const answersRouter = require('./routes/answers');
const satisfactionRouter = require('./routes/satisfaction');
const purchaseRouter = require('./routes/purchase');
const analyseRouter = require('./routes/analyse');
const app = express();
app.use(
  bodyParser.json({
      verify: function(req, res, buf) {
          req.rawBody = buf;
      }
  })
);
app.use(
  bodyParser.json({
      verify: function(req, res, buf) {
          req.rawBody = buf;
      }
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use('/events', eventRoutes);
app.use('/users', userRoutes);
app.use('/questions', questionsRouter);
app.use('/answers', answersRouter);
app.use('/satisfaction', satisfactionRouter);
app.use('/purchase', purchaseRouter);
app.use('/public', express.static('public'));
app.use('/', analyseRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
