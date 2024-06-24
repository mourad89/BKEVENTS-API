const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mourad.habboul@gmail.com',
    pass: 'faao gtud rdap zgim',
  },
});


module.exports = transporter;
