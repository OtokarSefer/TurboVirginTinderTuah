'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const UserRejections = sequelize.define("UserRejections", {
    userId1: { type: DataTypes.INTEGER, allowNull: false },
    userId2: { type: DataTypes.INTEGER, allowNull: false }
  });

  UserRejections.associate = (models) => {
      UserRejections.belongsTo(models.User, { foreignKey: "userId1", as: "User1" });
      UserRejections.belongsTo(models.User, { foreignKey: "userId2", as: "User2" });
  };

return UserRejections;
};