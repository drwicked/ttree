
const Wish = require('../models/Wish');
const User = require('../models/User');
const Models = require('../models/postgresModels');
const mongoose = require('mongoose');
const _ = require('underscore');
/**
 * GET /
 * Home page.
 */
 
 
exports.index = (req, res) => {
	
	var typeList = [
		"Need"
	]
	res.render('myWishes', {
		title: 'My Wishes'
	});
};

exports.myTree = (req, res) => {
	res.render('tree', {
		title: 'My Tree'
	});
}
exports.getWish = (req, res) => {
	Wish.findById(req.params.id,function(err,wish){
		res.render('wishview', {
			title: 'View Wish',
			wish: wish
		});
	})
}
exports.editWish = (req, res) => {
	Wish.findById(req.params.id,function(err,wish){
		res.render('edit', {
			title: 'Edit Wish',
			wish: wish
		});
	})
}
exports.getWishes = (req, res) => {
	Wish.find({}, null, {sort: {create_date: -1}}, function(err, docs) {
		res.json(docs);
		
	});
}
exports.removeWish = (req, res) => {
	//Book.remove(req.params.id);
	Wish.findById(req.params.id, function (err, wish) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            wish.remove(function (err, wish) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + wish._id);
                    res.format({
                        
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({message : 'deleted',
                                   item : wish
                               });
                         }
                      });
                }
            });
        }
    });
}

exports.listWishes = (req, res) => {
	//var user_wishes = req.user.wishes.map(function(id) { return mongoose.Types.ObjectId(id); });
	Wish.find({/* '_id': { $in: user_wishes} */}, null, {sort: {create_date: -1}}, function(err, docs) {
		res.json(docs);
		
	});
}

exports.getWishById = (req, res) => {
	Wish.findById(req.user.id)
}

var request = require('request');
var cheerio = require('cheerio');

exports.getDataFromURL = (req, res) => {
	console.log(req.body.URL);
	var urlQuery = req.body.URL;
	request(urlQuery, function (error, response, html) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(html);
			var urlData = {
				title: $("title").text()
			}
			res.json(urlData);
		}
	});
}

exports.newWish = (req, res) => {
	if (!req.user) {
		return res.redirect('/');
	}
/*
	
	const errors = req.validationErrors();

	if (errors) {
	req.flash('errors', errors);
	return res.redirect('/account');
	}
*/

  Models.Users.find({ where: { id: req.user.id } }).then(function(user) {
	  var newWishObj = {
		  title: req.body.title,
		  description: req.body.description,
		  ownerName: req.body.ownerName,
		  linkURL: req.body.URL,
		  neededBeforeDate: req.body.needed_before,
		  //db_: req.body.for_class,
		  UPC: req.body.UPC
  }
    Models.Wishes.create(newWishObj).then(function(w) {
      w.setUser(user).then(function() {
        res.redirect('/wishes')
      })
    })
  })

};

exports.updateWish = (req, res) => {
	if (!req.user) {
	return res.redirect('/');
	}
/*
	
	const errors = req.validationErrors();

	if (errors) {
	req.flash('errors', errors);
	return res.redirect('/account');
	}
*/

	Wish.findById(req.params.id, function (err, wish) {
        if (err) {
            return console.error(err);
        } else {
			wish.save((err) => {
				if (err) {
					console.log(err);
				} else {
					res.json({
						message : 'updated',
						item : wish
					});
				}
			});
            //remove it from Mongo
/*
            wish.remove(function (err, wish) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + wish._id);
                    res.format({
                        
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({message : 'deleted',
                                   item : wish
                               });
                         }
                      });
                }
            });
*/
        }
    });

};
