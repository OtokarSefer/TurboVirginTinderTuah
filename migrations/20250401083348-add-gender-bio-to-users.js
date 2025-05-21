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
    await queryInterface.addColumn('Users', 'pic', {
      type: Sequelize.STRING,
      defaultValue: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
      allowNull: false,
    });
    await queryInterface.addColumn('Users', 'minAgeP', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'maxAgeP', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'genderPref', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

// Add location, religin, interests and other types to filter matches with 
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'gender');
    await queryInterface.removeColumn('Users', 'bio');
    await queryInterface.removeColumn('Users', 'age');
    await queryInterface.removeColumn('Users', 'pic');
    await queryInterface.removeColumn('Users', 'minAgeP');
    await queryInterface.removeColumn('Users', 'maxAgeP');
    await queryInterface.removeColumn('Users', 'genderPref');
  }
};
