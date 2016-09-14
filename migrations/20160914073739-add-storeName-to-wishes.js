'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
	    
      queryInterface.addColumn(
        'Wishes',
        'storeName',
        {
          type: Sequelize.STRING
        }
      )
    ];
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('Wishes', 'storeName')
    ];
  }
};