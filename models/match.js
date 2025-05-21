'use strict';
const {  Model  } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Match = sequelize.define("Match", {
      userId1: { type: DataTypes.INTEGER, allowNull: false },
      userId2: { type: DataTypes.INTEGER, allowNull: false },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
      }
  });

  Match.associate = (models) => {
      Match.belongsTo(models.User, { foreignKey: "userId1", as: "User1" });
      Match.belongsTo(models.User, { foreignKey: "userId2", as: "User2" });
  };

  return Match;
};      