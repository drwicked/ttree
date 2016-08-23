'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
	 queryInterface.removeColumn('Wishes', 'wishType'),
      queryInterface.addColumn(
        'Wishes',
        'wishType',
        {
          type: Sequelize.STRING,
          defaultValue: 'wish'
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