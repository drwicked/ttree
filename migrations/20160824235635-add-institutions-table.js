'use strict';
module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.createTable('Institutions', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING,
				allowNull:false
			},
			shippingAddress: {
				type: Sequelize.TEXT
			},
			website: {
				type: Sequelize.TEXT
			},
			hasImage: { type: Sequelize.BOOLEAN },
			json: { type: Sequelize.JSON },
			institutionType: {
				type: Sequelize.STRING
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
		return queryInterface.dropTable('Institutions');
	}
};