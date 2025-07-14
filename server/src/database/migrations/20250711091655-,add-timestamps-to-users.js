'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add createdAt column
    await queryInterface.addColumn('users', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    // Add updatedAt column
    await queryInterface.addColumn('users', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove columns in reverse order
    await queryInterface.removeColumn('users', 'updatedAt');
    await queryInterface.removeColumn('users', 'createdAt');
  },
};
