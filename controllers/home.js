/**
 * GET /
 * Home page.
 */
const Wish = require('../models/Wish');
const News = require('../models/News');
const Email = require('../models/Email');
exports.index = (req, res) => {
	Wish.find({}, function(err,docs){
		  res.render('home', {
		    title: 'Home',
		    wishes: docs
		  });
	})
};
exports.news = (req, res) => {
	News.find({}, null, {sort: {create_date: -1}}, function(err, docs) {
		  res.render('news', {
		    title: 'News',
		    news: docs
		  });
	});
};
exports.submitEmail = (req, res) => {
	var newEmail = new Email({
		email:req.body.email
	}).save((err) => {
		if (err) {
			console.log(err);
		} else {
			res.json(200);
		}
	});
};
exports.postNews = (req, res) => {
	const post = new News(req.body);
	post.save((err) => {
		if (err) {
			console.log(err);
		} else {
			req.flash('success', { msg: 'New post added.' });
			res.redirect('/news');
		}
	});
};