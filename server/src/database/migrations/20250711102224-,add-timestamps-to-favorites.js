'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add createdAt to favorites
    await queryInterface.addColumn('favorites', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    // Add updatedAt to favorites
    await queryInterface.addColumn('favorites', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    // Update existing favorites rows
    await queryInterface.sequelize.query(`
      UPDATE favorites
      SET "createdAt" = CURRENT_TIMESTAMP, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "createdAt" IS NULL OR "updatedAt" IS NULL
    `);
  },

  async down(queryInterface, Sequelize) {
    // Remove columns in reverse order
    await queryInterface.removeColumn('favorites', 'updatedAt');
    await queryInterface.removeColumn('favorites', 'createdAt');
  },
};