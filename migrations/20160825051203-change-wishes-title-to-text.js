'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('Wishes', 'title'),
	    
      queryInterface.addColumn(
        'Wishes',
        'title',
        {
          type: Sequelize.TEXT,
          allowNull: true
        }
      )
    ];
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('Wishes', 'title')
    ];
  }
};