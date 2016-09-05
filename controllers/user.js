const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');
const Email = require('../models/Email');
const contactController = require('../controllers/contact.js');

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
			req.flash('success', { msg: 'Success! You are now logged in.' });
			res.redirect('/account');
		});
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
		
		username: req.body.username,
		salt: salt,
		password: hashedPassword
	}
	
	
	Models.Users.create(newUser).then(function(user) {
		req.logIn(user, (err) => {
			if (err) {
				console.log(err,114);
				return next(err);
			}
			
			  const mailOptions = {
			    to: 'admin@teachertree.org',
			    from: `${req.body.username} <${email}>`,
			    subject: `Welcome to TeacherTree ${req.body.username}!`,
			    text: "Welcome to TeacherTree!"
			  };
			
			
			
			contactController.mailgun.sendMail(mailOptions, function (err, info) {
			  if (err) {
			    console.log('Error: ' + err);
			      req.flash('errors', { msg: err.message });
			      return res.redirect('/signup');
			  }
			  else {
			    console.log('Mail sent ', info);
			    			   
				req.flash('success', { msg: 'Success! You are logged in.' })
				res.redirect('/account');
			  }
			});
			
			
		});
	}).catch(function(error) {
		console.log(error,122);
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

exports.checkUsername = (req, res) => {
	console.log(req.query);
/*
	Models.Users.find({ where: { username: req.query.username } }).then(function(user) {
		console.log(user);
*/
		Models.Users.findOne({
		  where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('username')), Sequelize.fn('lower', req.query.username))
		}).then(function(user){
		if (!!user && user.username.length > 0 ) {
			console.log(user.username,req.query.username);
			console.log("400");
			res.status(400).send('Username is taken');
		} else {
			console.log("200");
			res.status(200).send('Username is available');
		}
	},function(err){
		console.log(err);
	})
}

exports.postUpdateProfile = (req, res, next) => {
/*
	req.assert('email', 'Please enter a valid email address.').isEmail();
	req.sanitize('email').normalizeEmail({ remove_dots: false });
*/

	const errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect('/account');
	}
	//username: req.body.username,
	
	const shortid = require('shortid');
	Models.Users.update({
		name: req.body.name,
		username: req.body.username || shortid.generate(),
		bio: req.body.bio,
		status: req.body.status,
		hasProfileImage: req.body.hasProfileImage == 'true',
		hasSecondaryImage: req.body.hasSecondaryImage == 'true',
		schoolName: req.body.schoolName,
		shippingAddress: req.body.shippingAddress,
		location: req.body.location,
		website: req.body.website,
		//admin: true
	},{
		where: {id: req.user.id}
	}).then(function(user){
		req.flash('success', { msg: 'Profile information has been updated.' });
		res.redirect('/account');
	})

};

exports.postUpdateProfileWithSchool = (req, res, next) => {
/*
	req.assert('email', 'Please enter a valid email address.').isEmail();
	req.sanitize('email').normalizeEmail({ remove_dots: false });
*/

	const errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect('/account');
	}
	//username: req.body.username,
	
	Models.Institutions.findOrCreate(
		{where:{name:req.body.schoolname},defaults:{
			name: req.body.schoolName,
			location: req.body.location,
			location: req.body.shippingAddress,
		}})
	.spread(function(inst,created){
		var instId = inst.id || created.id;
		console.log(instId);
		
		Models.Users.update({
			name: req.body.name,
			username: req.body.username,
			bio: req.body.bio,
			status: req.body.status,
			hasProfileImage: req.body.hasProfileImage == 'true',
			hasSecondaryImage: req.body.hasSecondaryImage == 'true',
			schoolName: req.body.schoolName,
			InstitutionId: instId,
			shippingAddress: req.body.shippingAddress,
			location: req.body.location,
			website: req.body.website,
			//admin: true
		},{
			where: {id: req.user.id}
		}).then(function(user){
			req.flash('success', { msg: 'School information has been updated.' });
			res.redirect('/account');
		})

		
	})
	
	

};

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = (req, res) => {
	res.render('account/profile', {
		title: 'Account Management',
		userApi: req.user.api || {}
	});
};

exports.admin = (req, res) => {
	Models.Users.findAll({}).then(function(users){
		Models.Wishes.findAll({}).then(function(wishes){
			Models.Institutions.findAll({}).then(function(institutions){
				res.render('account/admin', {
					title: 'Administration Panel',
					users: users,
					wishesList: wishes,
					institutions: institutions,
					betaEmails: false
				});
		
			})
		
		})
						
	})
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

	Models.Users.update({
		password:req.body.password
	},{
		where: {id: req.user.id}
	}).then(function(user){
		req.flash('success', { msg: 'Password successfully updated.' });
		res.redirect('/account');
	})


/*
	User.findById(req.user.id, (err, user) => {
		if (err) { return next(err); }
		user.password = req.body.password;
		user.save((err) => {
			if (err) { return next(err); }
			req.flash('success', { msg: 'Password has been changed.' });
			res.redirect('/account');
		});
	});
*/
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


