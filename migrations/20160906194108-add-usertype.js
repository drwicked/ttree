'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
	    
      queryInterface.addColumn(
        'Users',
        'userType',
        {
          type: Sequelize.STRING,
          defaultValue: 'teacher'
        }
      )
    ];
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('Users', 'userType')
    ];
  }
};