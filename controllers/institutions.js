const Models = require('../models/postgresModels');
const _ = require('underscore');
 
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

exports.getInstitution = (req, res) => {
	Models.Institutions.find({ where: { id: req.params.id } }).then(function(institutions) {
		res.render('wishview', {
			title: 'View Institution',
			wish: institutions
		});
		
	})
}
exports.editWish = (req, res) => {
	Models.Institutions.find({ where: { id: req.params.id, ownerId: req.user.id } }).then(function(wish) {
		//This was a big revelation for some reason
		req.user.editWish = wish;
		res.render('edit', {
			title: 'Edit Wish',
			wish: wish
		});
	})
}
exports.removeWish = (req, res) => {
	Models.Institutions.destroy({ where: { id: req.params.id }}).then(function(institutions){
		res.format({
			json: function(){
				res.json({message : 'deleted',
					item : institutions
				});
			}
		});
	})
}

exports.listWishes = (req, res) => {
	Models.Institutions.findAll({ limit: 30, order: '"updatedAt" DESC' }).then(function(institutions) {
		res.json(institutions);
	})
}

exports.getMyWishes = (req, res) => {
	if (!req.user) {
		res.json(200)
	} else {
		Models.Wishes.findAll({ where: { ownerId: req.user.id } }).then(function(wishes) {
			res.json(wishes);
		})
		
	}
}


exports.createInstitution = (req, res) => {
	if (!req.user) {
		return res.redirect('/');
	}
	console.log(req.body);
    Models.Institutions.create(req.body).then(function(i) {
		res.redirect('/admin')
    })

};

exports.updateInstitution = (req, res) => {
	Models.Institutions.update({
		name: req.body.name,
		location: req.body.location,
		website: req.body.website,
		shippingAddress: req.body.shippingAddress,
		hasImage: req.body.hasImage == 'true',
	},{ where: { id: req.body.institutionId } }).then(function(w) {
		res.json(200)
    }, function(err){
	    console.log(err);
    })
}