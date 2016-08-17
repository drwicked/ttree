const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');
const Email = require('../models/Email');

/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
	if (req.user) {
		return res.redirect('/');
	}
	res.render('account/login', {
		title: 'Login'
	});
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
	req.assert('email', 'Email is not valid').isEmail();
	req.assert('password', 'Password cannot be blank').notEmpty();
	req.sanitize('email').normalizeEmail({ remove_dots: false });

	const errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect('/login');
	}

	passport.authenticate('local', (err, user, info) => {
		if (err) { return next(err); }
		if (!user) {
			req.flash('errors', info);
			return res.redirect('/login');
		}
		req.logIn(user, (err) => {
			if (err) { return next(err); }
			req.flash('success', { msg: 'Success! You are logged in.' });
			res.redirect(req.session.returnTo || '/');
		});
		console.log("wtf",user);
	})(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
	req.logout();
	res.redirect('/');
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
	if (req.user) {
		return res.redirect('/');
	}
	res.render('account/signup', {
		title: 'Create Account'
	});
};

/**
 * POST /signup
 * Create a new local account.
 */
 
var bcrypt = require('bcrypt'),
	Models = require('../models/postgresModels.js')
var Sequelize = require('sequelize')
var connection = new Sequelize('postgres://tuvtlqkr:AEe2K3k6J6kIJCeuiqu_xsnV6E6uW36B@elmer.db.elephantsql.com:5432/tuvtlqkr')

exports.p_signup = (req, res ) => {
	
	var email = req.body.email
	var password = req.body.password
	var confirmPassword = req.body.confirmPassword
	console.log(req.body);
	if (!email || !password) {
		req.flash('error', "Please, fill in all the fields.")
		res.redirect('signup')
	}
	

	if (password !== confirmPassword) {
		req.flash('error', "Please, enter the same password twice.")
		res.redirect('signup')
	}
	
	var salt = bcrypt.genSaltSync(10)
	var hashedPassword = bcrypt.hashSync(password, salt)
	
	var newUser = {
		email: email,
		salt: salt,
		password: hashedPassword
	}
	
	Models.User.create(newUser).then(function() {
		req.logIn(user, (err) => {
			if (err) {
				console.log(err);
				return next(err);
			}
			res.redirect('/');
		});
	}).catch(function(error) {
		console.log(error);
		req.flash('error', "Account with that email already exists.")
		res.redirect('/signup')
	})
}

exports.p_login = (req, res, next) => {
	req.assert('email', 'Email is not valid').isEmail();
	req.assert('password', 'Password cannot be blank').notEmpty();
	req.sanitize('email').normalizeEmail({ remove_dots: false });

	const errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect('/login');
	}

	passport.authenticate('local', (err, user, info) => {
		if (err) { return next(err); }
		if (!user) {
			req.flash('errors', info);
			return res.redirect('/login');
		}
		req.logIn(user, (err) => {
			if (err) { return next(err); }
			req.flash('success', { msg: 'Success! You are logged in.' });
			res.redirect(req.session.returnTo || '/');
		});
	})(req, res, next);
};

 
exports.postSignup = (req, res, next) => {
	req.assert('email', 'Email is not valid').isEmail();
	req.assert('password', 'Password must be at least 4 characters long').len(4);
	req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
	req.sanitize('email').normalizeEmail({ remove_dots: false });

	const errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect('/signup');
	}

	const user = new User({
		email: req.body.email,
		password: req.body.password
	});

	User.findOne({ email: req.body.email }, (err, existingUser) => {
		if (existingUser) {
			req.flash('errors', { msg: 'Account with that email address already exists.' });
			return res.redirect('/signup');
		}
		user.save((err) => {
			if (err) { return next(err); }
			req.logIn(user, (err) => {
				if (err) {
					return next(err);
				}
				res.redirect('/');
			});
		});
	});
};

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = (req, res) => {
	res.render('account/profile', {
		title: 'Account Management'
	});
};

exports.admin = (req, res) => {
	User.find({}, null, {}, function(err, users) {
		Email.find({}, null, {sort: {create_date: -1}}, function(err, emails) {
			res.render('account/admin', {
				title: 'Administration Panel',
				beta_emails: emails,
				users: users
			});
			
		});
		
	});
};


/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {
	req.assert('email', 'Please enter a valid email address.').isEmail();
	req.sanitize('email').normalizeEmail({ remove_dots: false });

	const errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect('/account');
	}

	User.findById(req.user.id, (err, user) => {
		if (err) { return next(err); }
		["real_name","bio","status","school_name","shipping_address"].forEach(function(value){
		 user.profile[value] = req.body[value]; 
		});
		
		user.email = req.body.email || '';
		user.profile.name = req.body.name || '';
		user.profile.gender = req.body.gender || '';
		user.profile.location = req.body.location || '';
		user.profile.website = req.body.website || '';
		user.save((err) => {
			if (err) {
				if (err.code === 11000) {
					req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
					return res.redirect('/account');
				}
				return next(err);
			}
			req.flash('success', { msg: 'Profile information has been updated.' });
			res.redirect('/account');
		});
	});
};


/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {
	req.assert('password', 'Password must be at least 4 characters long').len(4);
	req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

	const errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect('/account');
	}

	User.findById(req.user.id, (err, user) => {
		if (err) { return next(err); }
		user.password = req.body.password;
		user.save((err) => {
			if (err) { return next(err); }
			req.flash('success', { msg: 'Password has been changed.' });
			res.redirect('/account');
		});
	});
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {
	User.remove({ _id: req.user.id }, (err) => {
		if (err) { return next(err); }
		req.logout();
		req.flash('info', { msg: 'Your account has been deleted.' });
		res.redirect('/');
	});
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = (req, res, next) => {
	const provider = req.params.provider;
	User.findById(req.user.id, (err, user) => {
		if (err) { return next(err); }
		user[provider] = undefined;
		user.tokens = user.tokens.filter(token => token.kind !== provider);
		user.save((err) => {
			if (err) { return next(err); }
			req.flash('info', { msg: `${provider} account has been unlinked.` });
			res.redirect('/account');
		});
	});
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = (req, res, next) => {
	if (req.isAuthenticated()) {
		return res.redirect('/');
	}
	User
		.findOne({ passwordResetToken: req.params.token })
		.where('passwordResetExpires').gt(Date.now())
		.exec((err, user) => {
			if (err) { return next(err); }
			if (!user) {
				req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
				return res.redirect('/forgot');
			}
			res.render('account/reset', {
				title: 'Password Reset'
			});
		});
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = (req, res, next) => {
	req.assert('password', 'Password must be at least 4 characters long.').len(4);
	req.assert('confirm', 'Passwords must match.').equals(req.body.password);

	const errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect('back');
	}

	async.waterfall([
		function (done) {
			User
				.findOne({ passwordResetToken: req.params.token })
				.where('passwordResetExpires').gt(Date.now())
				.exec((err, user) => {
					if (err) { return next(err); }
					if (!user) {
						req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
						return res.redirect('back');
					}
					user.password = req.body.password;
					user.passwordResetToken = undefined;
					user.passwordResetExpires = undefined;
					user.save((err) => {
						if (err) { return next(err); }
						req.logIn(user, (err) => {
							done(err, user);
						});
					});
				});
		},
		function (user, done) {
			const transporter = nodemailer.createTransport({
				service: 'SendGrid',
				auth: {
					user: process.env.SENDGRID_USER,
					pass: process.env.SENDGRID_PASSWORD
				}
			});
			const mailOptions = {
				to: user.email,
				from: 'hackathon@starter.com',
				subject: 'Your Hackathon Starter password has been changed',
				text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
			};
			transporter.sendMail(mailOptions, (err) => {
				req.flash('success', { msg: 'Success! Your password has been changed.' });
				done(err);
			});
		}
	], (err) => {
		if (err) { return next(err); }
		res.redirect('/');
	});
};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect('/');
	}
	res.render('account/forgot', {
		title: 'Forgot Password'
	});
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res, next) => {
	req.assert('email', 'Please enter a valid email address.').isEmail();
	req.sanitize('email').normalizeEmail({ remove_dots: false });

	const errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect('/forgot');
	}

	async.waterfall([
		function (done) {
			crypto.randomBytes(16, (err, buf) => {
				const token = buf.toString('hex');
				done(err, token);
			});
		},
		function (token, done) {
			User.findOne({ email: req.body.email }, (err, user) => {
				if (!user) {
					req.flash('errors', { msg: 'Account with that email address does not exist.' });
					return res.redirect('/forgot');
				}
				user.passwordResetToken = token;
				user.passwordResetExpires = Date.now() + 3600000; // 1 hour
				user.save((err) => {
					done(err, token, user);
				});
			});
		},
		function (token, user, done) {
			const transporter = nodemailer.createTransport({
				service: 'SendGrid',
				auth: {
					user: process.env.SENDGRID_USER,
					pass: process.env.SENDGRID_PASSWORD
				}
			});
			const mailOptions = {
				to: user.email,
				from: 'hackathon@starter.com',
				subject: 'Reset your password on Hackathon Starter',
				text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
					Please click on the following link, or paste this into your browser to complete the process:\n\n
					http://${req.headers.host}/reset/${token}\n\n
					If you did not request this, please ignore this email and your password will remain unchanged.\n`
			};
			transporter.sendMail(mailOptions, (err) => {
				req.flash('info', { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
				done(err);
			});
		}
	], (err) => {
		if (err) { return next(err); }
		res.redirect('/forgot');
	});
};


///////////////


