'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
	    
      queryInterface.removeColumn('Wishes', 'linkURL'),
      queryInterface.removeColumn('Wishes', 'imageURL'),
      queryInterface.addColumn(
        'Wishes',
        'imageURL',
        {
          type: Sequelize.TEXT,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'Wishes',
        'linkURL',
        {
          type: Sequelize.TEXT,
          allowNull: true
        }
      )
    ];
  },

  down: function (queryInterface, Sequelize) {
    return [
	    
    ];
  }
};