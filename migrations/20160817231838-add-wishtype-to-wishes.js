'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
	    
      queryInterface.addColumn(
        'Wishes',
        'wishType',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      )
    ];
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('Wishes', 'wishType')
    ];
  }
};