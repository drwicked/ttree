'use strict';
module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			email: { type: Sequelize.STRING },
			name: { type: Sequelize.STRING },
			bio: { type: Sequelize.TEXT },
			profile: { type:Sequelize.JSON },
			api: { type: Sequelize.JSON },
			status: { type: Sequelize.STRING },
			schoolName: { type: Sequelize.STRING },
			shippingAddress: { type: Sequelize.STRING },
			location: { type: Sequelize.STRING },
			website: { type: Sequelize.STRING },
			picture: { type: Sequelize.STRING },
			password: { type: Sequelize.STRING },
			salt: { type: Sequelize.STRING },
			admin: { type: Sequelize.BOOLEAN },
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: function(queryInterface, Sequelize) {
		return queryInterface.dropTable('Users');
	}
};