'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
	    
      queryInterface.removeColumn('Users', 'WishId'),
      queryInterface.removeColumn('Wishes', 'WishId'),
      
      queryInterface.addColumn(
        'Users',
        'WishId',
        {
          type: Sequelize.INTEGER
        }
      )
    ];
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('Users', 'WishId')
    ];
  }
};