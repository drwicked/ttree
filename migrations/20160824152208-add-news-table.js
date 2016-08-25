'use strict';
module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.createTable('News', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
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
			tags: { type: Sequelize.ARRAY(Sequelize.STRING) },
			isPublic: {
				type: Sequelize.BOOLEAN,
				defaultValue:true
			},
			postType: {
				type: Sequelize.STRING,
				defaultValue: 'post'
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
		return queryInterface.dropTable('News');
	}
};