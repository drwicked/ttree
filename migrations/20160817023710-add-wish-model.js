'use strict';
module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.createTable('Wishes', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			title: {
				type: Sequelize.STRING,
				allowNull: false
			},
			description: { type: Sequelize.TEXT },
			tags: { type: Sequelize.TEXT },
			linkURL: { type: Sequelize.STRING,},
			imageURL: { type: Sequelize.STRING,},
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