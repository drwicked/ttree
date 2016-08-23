var Sequelize = require('sequelize')
var connection = new Sequelize('postgres://tuvtlqkr:AEe2K3k6J6kIJCeuiqu_xsnV6E6uW36B@elmer.db.elephantsql.com:5432/tuvtlqkr')
var shortid = require('shortid');
var Users = connection.define('Users', {
	username: {
		type: Sequelize.STRING,
		unique: true,
		validate: {
			is: /^[a-z0-9\_\-]+$/i,
		}
	},
	name: { type: Sequelize.STRING },
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			isEmail: true
		}
	},
	profile: { type:Sequelize.JSON },
	hasProfileImage: { type: Sequelize.BOOLEAN },
	hasSecondaryImage: { type: Sequelize.BOOLEAN },
	api: { type: Sequelize.JSON },
	bio: { type: Sequelize.TEXT },
	status: { type: Sequelize.STRING },
	schoolName: { type: Sequelize.STRING },
	shippingAddress: { type: Sequelize.STRING },
	location: { type: Sequelize.STRING },
	website: { type: Sequelize.STRING },
	picture: { type: Sequelize.STRING },
	password: { type: Sequelize.STRING },
	salt: { type: Sequelize.STRING },
	admin: { type: Sequelize.BOOLEAN },
}, { //options
	classMethods:{
		associate: function(models) {
			console.log("flerb:",models);
			Users.hasMany(models.Wishes)
      	}
    },
	freezeTableName: true
})



var Wishes = connection.define('Wishes', {
	title: {
		type: Sequelize.STRING,
		allowNull: false
	},
	//shortId: function(){shortid.generate()},
	ownerName: { type: Sequelize.STRING, },
	ownerId: { type: Sequelize.INTEGER, },
	schoolName: { type: Sequelize.STRING, },
	schoolId: { type: Sequelize.INTEGER, },
	className: { type: Sequelize.STRING, },
	classId: { type: Sequelize.INTEGER, },
	wishType: { type: Sequelize.STRING },
	description: { type: Sequelize.TEXT },
	tags: { type: Sequelize.TEXT },
	linkURL: { type: Sequelize.TEXT,},
	imageURL: { type: Sequelize.TEXT,},
	neededBeforeDate: { type: Sequelize.DATE },
	purchaser: { type: Sequelize.STRING },
	purchaseDate: { type: Sequelize.DATE },
	deliverDate: { type: Sequelize.DATE },
	shipTo: { type: Sequelize.TEXT},
	UPC: { type: Sequelize.STRING },
	quantity: {
		type: Sequelize.INTEGER,
		defaultValue: 1
	},
	urgency: { type: Sequelize.INTEGER },
	status: { type: Sequelize.STRING, },
	notes: { type:Sequelize.JSON },
	json: { type: Sequelize.JSON },
	isPublic: {
		type: Sequelize.BOOLEAN,
		defaultValue: true
	},
}, { //options
	classMethods: {
      associate: function(models) {
        Wishes.belongsTo(models.Users, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    },
    name: {
		singular: 'wish',
		plural: 'wishes',
	},
	freezeTableName: true
})

Users.hasMany(Wishes);
Wishes.belongsTo(Users, {foreignKey: 'ownerId'});

module.exports.Wishes = Wishes;
module.exports.Users = Users;
module.exports.connection = connection;
/*
var Organization = connection.define('organization', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	description: { type: Sequelize.TEXT},
	website: { type: Sequelize.STRING,},
	location: { type: Sequelize.STRING, },
	address: { type: Sequelize.STRING, },
	shippingAddress: { type: Sequelize.STRING, },
	imageURL: { type: Sequelize.STRING,},
	json: { type: Sequelize.JSON }
}, { //options
	freezeTableName: true
})
//Wish.belongsTo(Organization);

module.exports.Organization = Organization;
*/