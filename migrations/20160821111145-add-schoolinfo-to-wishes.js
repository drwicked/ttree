'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn(
        'Wishes',
        'schoolName',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'Wishes',
        'schoolId',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      )
    ];
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('Wishes', 'schoolName'),
      queryInterface.removeColumn('Wishes', 'schoolId')
    ];
  }
};