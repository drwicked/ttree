/**
 * GET /
 * Home page.
 */
const Wish = require('../models/Wish');
const News = require('../models/News');
const Email = require('../models/Email');
const Models = require('../models/postgresModels');
exports.index = (req, res) => {
	Wish.find({}, function(err,docs){
		  res.render('home', {
		    title: 'Home',
		    wishes: docs
		  });
	})
};
exports.bookWitchery = (req, res) => {
  res.render('witchery', {
    title: 'Bookwitchery'
  });
};
exports.news = (req, res) => {
	Models.News.findAll({ limit: 10, order: '"updatedAt" DESC' }).then(function(news){
		res.render('news', {
			title: 'News',
			news: news
		});
		
	})
};

exports.postNews = (req, res) => {

    Models.News.create(req.body).then(function(result) {
		req.flash('success', { msg: 'New post added.' });
		res.redirect('/news');
    })

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
exports._postNews = (req, res) => {
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