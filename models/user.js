'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(User, {
        through: "Match", 
        as: "MatchedUsers", 
        foreignKey: "userId1", 
        otherKey: "userId2" 
      });
      
      User.belongsToMany(User, { 
        through: "Match", 
        as: "MatchedByUsers",  
        foreignKey: "userId2", 
        otherKey: "userId1"    
      });

      User.belongsToMany(User, {
        through: models.UserRejections, 
        as: "RejectedUsers", 
        foreignKey: "userId1", 
        otherKey: "userId2" 
      });
      
      User.belongsToMany(User, { 
        through: models.UserRejections, 
        as: "RejectedByUsers",  
        foreignKey: "userId2", 
        otherKey: "userId1"    
      });
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('M', 'F'),
      allowNull: true
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pic: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'

    },
    minAgeP: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    maxAgeP: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    genderPref: {
      type: DataTypes.STRING,
      allowNull: true
    }
    }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};