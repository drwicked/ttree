'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
	    
      queryInterface.addColumn(
        'Users',
        'districtId',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'Users',
        'districtName',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'Users',
        'karma',
        {
          type: Sequelize.INTEGER,
          defaultValue: 0
        }
      ),
      queryInterface.addColumn(
        'Wishes',
        'tracking',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      )
    ];
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('Users', 'districtId'),
      queryInterface.removeColumn('Users', 'districtName'),
      queryInterface.removeColumn('Wishes', 'tracking'),
    ];
  }
};