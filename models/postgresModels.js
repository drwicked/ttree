var Sequelize = require('sequelize')
var connection = new Sequelize('postgres://tuvtlqkr:AEe2K3k6J6kIJCeuiqu_xsnV6E6uW36B@elmer.db.elephantsql.com:5432/tuvtlqkr')

var Users = connection.define('Users', {
	username: {
		type: Sequelize.STRING,
		unique: true,
		validate: {
			is: /^[a-z0-9\_\-]+$/i,
		}
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			isEmail: true
		}
	},
	profile: { type:Sequelize.JSON },
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
	freezeTableName: true
})

module.exports.Users = Users;
/*

var Wish = connection.define('wish', {
	wishId: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV1,
		unique: true
	},
	neededBefore: { type: Sequelize.DATE },
	title: {
		type: Sequelize.STRING,
		allowNull: false
	},
	description: { type: Sequelize.TEXT,},
	linkURL: { type: Sequelize.STRING,},
	imageURL: { type: Sequelize.STRING,},
	UPC: { type: Sequelize.STRING },
	quantity: {
		type: Sequelize.INTEGER,
		defaultValue: 1
	},
	urgency: { type: Sequelize.INTEGER },
	notes: { type:Sequelize.JSON },
	json: { type: Sequelize.JSON },
	status: { type: Sequelize.STRING, },
	location: { type: Sequelize.STRING, },
	website: { type: Sequelize.STRING, },
	picture: { type: Sequelize.STRING, },
	password: { type: Sequelize.STRING, },
	salt: { type: Sequelize.STRING },
	isPublic: {
		type: Sequelize.BOOLEAN,
		defaultValue: true
	},
}, { //options
	freezeTableName: true
})

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
User.hasMany(Wish, {as: 'Wishes'})
//Wish.belongsTo(Organization);
Wish.hasOne(User);

module.exports.Wish = Wish;
module.exports.Organization = Organization;
*/