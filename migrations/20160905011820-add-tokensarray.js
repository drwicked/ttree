'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
	    
      queryInterface.addColumn(
        'Users',
        'tokens',
        {
          type: Sequelize.ARRAY(Sequelize.STRING)
        }
      )
    ];
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('Users', 'tokens')
    ];
  }
};