const nodemailer = require('nodemailer');


var mg = require('nodemailer-mailgun-transport');

var auth = {
  auth: {
    api_key: 'key-ccb5131bb2b450567b428a46f643cbf6',
    domain: 'mail.teachertree.org'
  }
}
const nodemailerMailgun = nodemailer.createTransport(mg(auth));
exports.getContact = (req, res) => {
  res.render('contact', {
    title: 'Join the Beta'
  });
};

exports.mailgun = nodemailerMailgun;
exports.postContact = (req, res) => {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  const mailOptions = {
    to: 'admin@teachertree.org',
    from: `${req.body.name} <${req.body.email}>`,
    subject: `TTree Beta signup from ${req.body.name}`,
    text: req.body.message || "No message"
  };



nodemailerMailgun.sendMail(mailOptions, function (err, info) {
  if (err) {
    console.log('Error: ' + err);
      req.flash('errors', { msg: err.message });
      return res.redirect('/contact');
  }
  else {
    console.log('Mail sent ', info);
    
    req.flash('success', { msg: "Email sent! We'll be in touch soon." });
    res.redirect('/contact');
  }
});

};
