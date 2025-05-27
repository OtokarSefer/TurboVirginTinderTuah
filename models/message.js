'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      // Each message belongs to one sender
      Message.belongsTo(models.User, {
        foreignKey: 'senderId',
        as: 'sender'
      });
      // Each message belongs to one receiver
      Message.belongsTo(models.User, {
        foreignKey: 'receiverId',
        as: 'receiver'
      });
    }
  }
  Message.init({
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'Messages',
    timestamps: true 
  });
  return Message;
};
