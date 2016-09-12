'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('Wishes', 'urgency'),
	    
      queryInterface.addColumn(
        'Wishes',
        'urgency',
        {
          type: Sequelize.INTEGER,
          defaultValue: 50
        }
      )
    ];
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('Wishes', 'urgency')
    ];
  }
};