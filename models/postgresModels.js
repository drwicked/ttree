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
	google: { type: Sequelize.TEXT },
	facebook: { type: Sequelize.TEXT },
	tokens: { type: Sequelize.ARRAY(Sequelize.STRING) },
	bio: { type: Sequelize.TEXT },
	status: { type: Sequelize.STRING },
	schoolName: { type: Sequelize.STRING },
	districtId: { type: Sequelize.INTEGER },
	districtName: { type: Sequelize.STRING },
	karma: { type: Sequelize.INTEGER},
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
		type: Sequelize.TEXT,
		allowNull: false
	},
	//shortId: function(){shortid.generate()},
	ownerName: { type: Sequelize.STRING, },
	ownerId: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
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
	tracking: { type: Sequelize.STRING, },
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

Users.hasMany(Wishes, {foreignKey: 'ownerId', as:'Wishes'});
Wishes.belongsTo(Users, {foreignKey: 'ownerId', as:'Owner'});

module.exports.Wishes = Wishes;
module.exports.Users = Users;
module.exports.connection = connection;

module.exports.BetaEmails = connection.define('BetaEmails', {
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			isEmail: true
		}
	},
	replied: {type: Sequelize.BOOLEAN},
	
}, { //options
	freezeTableName: true
})

module.exports.News = connection.define('News', {
	owner: {
		type: Sequelize.STRING,
		allowNull:false
	},
	ownerName: {
		type: Sequelize.STRING,
		allowNull:false
	},
	title: {
		type: Sequelize.STRING,
		allowNull:false
	},
	category: {
		type: Sequelize.STRING,
		defaultValue:'News'
	},
	body: { type: Sequelize.TEXT },
	tags: { type: Sequelize.ARRAY(Sequelize.TEXT) },
	isPublic: {
		type: Sequelize.BOOLEAN,
		defaultValue:true
	},
	postType: {
		type: Sequelize.STRING,
		defaultValue: 'post'
	},
	
}, { //options
	freezeTableName: true
})


var Institutions = connection.define('Institutions', {
	name: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false
	},
	location: { type: Sequelize.STRING, },
	website: { type: Sequelize.STRING,},
	shippingAddress: { type: Sequelize.STRING, },
	hasImage: { type: Sequelize.BOOLEAN, },
	json: { type: Sequelize.JSON }
}, { //options
	freezeTableName: true
})
Users.belongsTo(Institutions);

module.exports.Institutions = Institutions;
