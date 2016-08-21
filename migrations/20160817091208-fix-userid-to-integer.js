'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
	    
      queryInterface.removeColumn('Wishes', 'UserId'),
      queryInterface.addColumn(
        'Wishes',
        'UserId',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      )
    ];
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('Wishes', 'UserId')
    ];
  }
};