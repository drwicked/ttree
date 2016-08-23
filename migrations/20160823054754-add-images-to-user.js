'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn(
        'Users',
        'hasProfileImage',
        {
          type: Sequelize.BOOLEAN
        }
      ),
      queryInterface.addColumn(
        'Users',
        'hasSecondaryImage',
        {
          type: Sequelize.BOOLEAN
        }
      )
    ];
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('Users', 'hasProfileImage'),
      queryInterface.removeColumn('Users', 'hasSecondaryImage')
    ];
  }
};