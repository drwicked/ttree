'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
	  queryInterface.removeColumn('Wishes', 'deliverDate'),
      queryInterface.addColumn(
        'Wishes',
        'shipped',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }
      ),
      queryInterface.addColumn(
        'Wishes',
        'shipDate',
        {
          type: Sequelize.DATE
        }
      ),
      queryInterface.addColumn(
        'Wishes',
        'fulfillDate',
        {
          type: Sequelize.DATE
        }
      ),
      queryInterface.addColumn(
        'Wishes',
        'fulfilled',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }
      )
    ];
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('Wishes', 'shipped'),
      queryInterface.removeColumn('Wishes', 'fulfilled'),
      queryInterface.removeColumn('Wishes', 'fulfillDate'),
      queryInterface.removeColumn('Wishes', 'shipDate'),
    ];
  }
};