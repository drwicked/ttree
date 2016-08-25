
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
	if (req.user){
		req.user.editWish = false;
		
	}
	res.render('myWishes', {
		title: 'My Wishes'
	});
};

exports.myTree = (req, res) => {
	Models.Wishes.findAll({ where: { ownerId: req.user.id }, order: '"updatedAt" DESC' }  ).then(function(wishes) {
		res.render('tree', {
			title: 'My Tree',
			userInfo: req.user,
			wishesList: wishes 
		});
	})
}
exports.viewTreeById = (req, res) => {
/*
	Models.Users.findAll({where: {id: req.params.id}, include: [{model:Models.Wishes, as: 'Wishes'}] }).then(function(user) {		
		console.dir(user.Wishes);
		res.render('tree', {
			title: 'Tree',
			userInfo: user,
			wishesList: false//user.Wishes
		});
	},function(err){
		console.log(err);
	})
*/

	Models.Users.find({where: {id: req.params.id}, include: [{model:Models.Wishes, as: 'Wishes'}] }).then(function(user) {
		user.getWishes().then(function(w){
			res.render('tree', {
				title: 'Tree',
				userInfo: user,
				wishesList: w
			});
		})
	},function(err){
		console.log(err);
	})

}

exports.getWish = (req, res) => {
	Models.Wishes.find({ where: { id: req.params.id } }).then(function(wish) {
		res.render('wishview', {
			title: 'View Wish',
			wish: wish
		});
		
	})
}
exports.editWish = (req, res) => {
	Models.Wishes.find({ where: { id: req.params.id, /* ownerId: req.user.id */ } }).then(function(wish) {
		//This was a big revelation for some reason
		req.user.editWish = wish;
		res.render('edit', {
			title: 'Edit Wish',
			wish: wish
		});
	})
}
exports.removeWish = (req, res) => {
	Models.Wishes.destroy({ where: { id: req.params.id }}).then(function(wish){
		res.format({
			json: function(){
				res.json({message : 'deleted',
					item : wish
				});
			}
		});
	})
/*
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
*/
}

exports.listWishes = (req, res) => {
	Models.Wishes.findAll({ limit: 30, order: '"createdAt" DESC' }).then(function(wishes) {
		res.json(wishes);
		
	})
}

exports.getMyWishes = (req, res) => {
/*
	Models.Users.findAll({where: {id: req.user.id}, include: [{model:Models.Wishes, as: 'Wishes'}] }).then(function(user) {
		user.getWishes().then(function(w){
			res.json(w);
		})
	})
*/
	Models.Wishes.findAll({ where: { ownerId: req.user.id } }).then(function(wishes) {
		console.log(req.user.id+":::::"+wishes.length);
		res.json(wishes);
	})

}

exports.findWishesByTeacherName = (req, res) => {

	Modules.Wishes.findAll({where: {title: {like: '%' + req.params.query + '%'}}}).success(function(wishes) {
		for (var i=0; i<wishes.length; i++) {
			console.log(wishes[i].title + " " + wishes[i].description);
		}
	});
}

exports.findWishesBySchoolName = (req, res) => {
	Modules.Wishes.findAll({where: {schoolName: {like: '%' + req.params.query + '%'}}}).success(function(wishes) {
		for (var i=0; i<wishes.length; i++) {
			console.log(wishes[i].title + " " + wishes[i].description);
		}
	});
}

exports.findWishesByClassName = (req, res) => {
	Modules.Wishes.findAll({where: {className: {like: '%' + req.params.query + '%'}}}).success(function(wishes) {
		for (var i=0; i<wishes.length; i++) {
			console.log(wishes[i].title + " " + wishes[i].description);
		}
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
				title: $("title").text(),
				image: $('#imgTagWrapperId > img').attr('src')
			}
			res.json(urlData);
		}
	});
}

exports.newWish = (req, res) => {
	if (!req.user) {
		return res.redirect('/');
	}

	Models.Users.find({ where: { id: req.user.id } }).then(function(user) {
		var newWishObj = {
			ownerId: req.user.id,
			ownerName: req.body.ownerName,
			title: req.body.title,
			description: req.body.description,
			wishType: req.body.wishType,
			forClass: req.body.forClass,
			forGrade: req.body.forGrade,
			schoolId: req.body.schoolId,
			schoolName: req.body.schoolName,
			linkURL: req.body.URL,
			imageURL: req.body.imageURL,
			neededBeforeDate: new Date(req.body.neededBefore),
			//db_: req.body.for_class,
			UPC: req.body.UPC
		}
    Models.Wishes.create(newWishObj).then(function(w) {
		//user.setWishes(w).then(function(){
		//w.setUsers(user).then(function() {
			res.redirect('/wishes')
		//})
		//});
			
    })
  })

};

exports.updateWish = (req, res) => {
	Models.Wishes.update({
		title: req.body.title,
		description: req.body.description,
		wishType: req.body.wishType,
		forClass: req.body.forClass,
		forGrade: req.body.forGrade,
		ownerId: req.user.id,
		schoolId: req.body.schoolId,
		schoolName: req.body.schoolName,
		linkURL: req.body.URL,
		imageURL: req.body.imageURL,
		neededBeforeDate: new Date(req.body.neededBefore),
		UPC: req.body.UPC
	},{ where: { id: req.body.wishId } }).then(function(w) {
		res.json(200)
    }, function(err){
	    console.log(err);
    })
}