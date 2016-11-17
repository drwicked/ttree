
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
	res.render('addWish', {
		title: 'Add Wish'
	});
};

exports.myTree = (req, res) => {
	Models.Wishes.findAll({ where: { ownerId: req.user.id }, order: '"urgency" DESC' }  ).then(function(wishes) {
		const wishCount = wishes.length || 0;
			res.render('tree', {
			title: 'My Tree',
			userInfo: req.user,
			wishesList: wishes,
			wishCount: wishCount
		});
	})
}

exports.getJSONById = (req, res) => {
	Models.Users.find({where: {id: req.params.id}, include: [{model:Models.Wishes, as: 'Wishes'}] }).then(function(user) {
		// FINALLY FIXED ORDERING
		user.getWishes({order:[ ['urgency','DESC'] ]}).then(function(w){
			const wishCount = w.length || 0;
			console.log(user.username + " has " + wishCount + " wishes");
			var userData = user;
			userData.wishesList = w;
			userData.wishCount = wishCount;
			res.send(JSON.stringify(userData));
		})
	},function(err){
		console.log(err);
	})


/*
	Models.Users.find({where: {id: req.params.id},
		include: [
			{model:Models.Wishes, as: 'Wishes'}
		],
		order: ' "Wishes"."urgency" DESC'
		}).then(function(user) {
		user.getWishes().then(function(w){
			const wishCount = w.length || 0;
			res.render('tree', {
				title: 'Tree',
				userInfo: user,
				wishesList: w,
				wishCount: wishCount
			});
		})
	},function(err){
		console.log(err);
	})
*/

}


exports.viewTreeById = (req, res) => {
	Models.Users.find({where: {id: req.params.id}, include: [{model:Models.Wishes, as: 'Wishes'}] }).then(function(user) {
		// FINALLY FIXED ORDERING
		user.getWishes({order:[ ['urgency','DESC'] ]}).then(function(w){
			const wishCount = w.length || 0;
			
			res.render('tree', {
				title: user.username+ "'s Tree",
				userInfo: user,
				wishesList: w,
				wishCount: wishCount
			});
		})
	},function(err){
		console.log(err);
	})


/*
	Models.Users.find({where: {id: req.params.id},
		include: [
			{model:Models.Wishes, as: 'Wishes'}
		],
		order: ' "Wishes"."urgency" DESC'
		}).then(function(user) {
		user.getWishes().then(function(w){
			const wishCount = w.length || 0;
			res.render('tree', {
				title: 'Tree',
				userInfo: user,
				wishesList: w,
				wishCount: wishCount
			});
		})
	},function(err){
		console.log(err);
	})
*/

}

exports.viewTreeByUsername = (req, res) => {

/*
	Models.Wishes.findAll({
			where: {ownerName: req.params.username},
			order: 'urgency DESC'
		}).then(function(wishes) {		
		
		res.render('tree', {
			title: 'Tree',
			userInfo: {},
			wishesList: wishes
		});
	},function(err){
		console.log(err);
	})

*/	

	Models.Users.find({where: {username: req.params.username}, include: [{model:Models.Wishes, as: 'Wishes'}] }).then(function(user) {
	//console.log(req.params,user);
	//Models.Users.find({where: {id: req.params.id}, include: [{model:Models.Wishes, as: 'Wishes'}] }).then(function(user) {
	
		// FINALLY FIXED ORDERING
		if (!!user){
			user.getWishes({order:[ ['urgency','DESC'] ]}).then(function(w){
				const wishCount = w.length || 0;
				
				res.render('tree', {
					title: user.username+ "'s Tree",
					userInfo: user,
					wishesList: w,
					wishCount: wishCount
				});
			})
		} else {
			req.flash('error', "User not found.")
			res.redirect('/')
		}
			
	},function(err){
		console.log(err);
	})


}

exports.treeJSON = (req, res) => {

	Models.Users.find({where: {username: req.params.username}, include: [{model:Models.Wishes, as: 'Wishes'}] }).then(function(user) {
	//console.log(req.params,user);
	//Models.Users.find({where: {id: req.params.id}, include: [{model:Models.Wishes, as: 'Wishes'}] }).then(function(user) {
	
		// FINALLY FIXED ORDERING
		if (!!user){
			user.getWishes({order:[ ['urgency','DESC'] ]}).then(function(w){
				const wishCount = w.length || 0;
				
				res.json({
					title: user.username+ "'s Tree",
					userInfo: user,
					wishesList: w,
					wishCount: wishCount
				});
			})
		} else {
			res.json(300)
		}
			
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
	Models.Wishes.find({ where: { id: req.params.id,  /* ownerId: req.user.id */  } }).then(function(wish) {
		//This was a big revelation for some reason
		req.user.editWish = wish;
		res.render('edit', {
			title: 'Edit Wish',
			wish: wish
		});
	}, function(err){
		req.flash('error', "Wish not found.")
		res.redirect('/')
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

	Models.Wishes.findAll({where: {ownerName: {like: '%' + req.params.query + '%'}}}).success(function(wishes) {
		for (var i=0; i<wishes.length; i++) {
			console.log(wishes[i].title + " " + wishes[i].description);
		}
	});
}

exports.findWishesBySchoolName = (req, res) => {
	Models.Wishes.findAll({where: {schoolName: {like: '%' + req.params.query + '%'}}}).success(function(wishes) {
		for (var i=0; i<wishes.length; i++) {
			console.log(wishes[i].title + " " + wishes[i].description);
		}
	});
}

exports.findWishesByClassName = (req, res) => {
	Models.Wishes.findAll({where: {className: {like: '%' + req.params.query + '%'}}}).success(function(wishes) {
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
console.log(req.body);
	Models.Users.find({ where: { id: req.user.id } }).then(function(user) {
		var newWishObj = {
			ownerId: req.user.id,
			ownerName: req.body.ownerName,
			title: req.body.title,
			description: req.body.description,
			wishType: req.body.wishType,
			urgency: req.body.urgency,
			// forClass: req.body.forClass,
			// forGrade: req.body.forGrade,
			schoolId: req.body.schoolId,
			schoolName: req.body.schoolName,
			linkURL: req.body.URL,
			storeName: req.body.storeName,
			imageURL: req.body.imageURL,
			neededBeforeDate: new Date(req.body.neededBefore),
			UPC: req.body.UPC
		}
    Models.Wishes.create(newWishObj).then(function(w) {
		//user.setWishes(w).then(function(){
		//w.setUsers(user).then(function() {
			req.flash('success', { msg: 'Wish added successfully. You can <a href="+/wish/edit/+'+w.id+'">Edit this wish</a>' });
			res.redirect('/wishes')
		//})
		//});
			
    })
  })

};

exports.updateWish = (req, res) => {
	Models.Wishes.update({
		title: req.body.title,
		ownerId: req.body.ownerId,
		ownerName: req.body.ownerName,
		description: req.body.description,
		wishType: req.body.wishType,
		urgency: req.body.urgency,
		// forClass: req.body.forClass,
		// forGrade: req.body.forGrade,
		schoolId: req.body.schoolId,
		schoolName: req.body.schoolName,
		linkURL: req.body.URL,
		storeName: req.body.storeName,
		imageURL: req.body.imageURL,
		neededBeforeDate: new Date(req.body.neededBefore),
		UPC: req.body.UPC
	},{ where: { id: req.body.wishId } }).then(function(w) {
/*
		req.flash('success', { msg: 'Wish updated successfully.' });
		res.redirect('/wishes')
*/
		//req.flash('success', { msg: 'Wish updated' });
		//res.redirect('/tree')
		res.status(200).send("Wish updated")
    }, function(err){
	    res.status(400).send("Somehow fail")
    })
}

exports.shipWish = (req, res) => {
	Models.Wishes.update({
		shipped: true,
		shipDate: new Date(),
		purchaser: req.user.username,
	},{ where: { id: req.params.id } }).then(function(w) {
		console.log("Wish updated: "+req.params.id);
		res.status(200).send("Wish marked as shipped, check your email")
    }, function(err){
	    res.status(400).send("Somehow fail")
    })
}
exports.fulfillWish = (req, res) => {
	Models.Wishes.update({
		fulfilled: true,
		fulfillDate: new Date(),
	},{ where: { id: req.params.id } }).then(function(w) {
		console.log("Wish updated: "+req.params.id);
		res.status(200).send("Wish fulfilled")
    }, function(err){
	    res.status(400).send("Somehow fail")
    })
}