'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
	    
      queryInterface.removeColumn('Wishes', 'WishId'),
      
      queryInterface.addColumn(
        'Wishes',
        'WishId',
        {
          type: Sequelize.STRING
        }
      )
    ];
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('Wishes', 'WishId')
    ];
  }
};