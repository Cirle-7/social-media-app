const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const logger = require("./../utils/logger");

// creating User model
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      githubId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      googleId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      passwordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      passwordResetExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isPrivate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
      deletionDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
    },
    {
      tableName: "users",
    }
  );

  // HASH PASSWORD HOOK
  User.beforeCreate(async function (user) {
    password = user.password;
    let oldEmail = user.email;
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.email = oldEmail.toLowerCase();
    }
  });

  // //HASH PASSWORD ON RESET OR UPDATE OF ACCOUNT INFO
  User.beforeSave(async (user) => {
    if (!user.changed("passwordToken")) {
      return;
    } else {
      user.password = await bcrypt.hash(user.password, 12);
    }
  });

  // CREATE JWT TOKEN INSTANCE
  User.prototype.createJwt = async function () {
    return await jwt.sign({ user_id: this.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
  };
  
  //COMPARE PASSWWORD INSTANCE
  User.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};
