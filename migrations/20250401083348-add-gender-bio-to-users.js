'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'gender', {
      type: Sequelize.ENUM('M', 'F'),
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'bio', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'age', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'gender');
    await queryInterface.removeColumn('Users', 'bio');
    await queryInterface.removeColumn('Users', 'age')
  }
};
