const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const logger = require("./../utils/logger");

// creating User model
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
<<<<<<< HEAD
=======
      githubId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      googleId:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
>>>>>>> 4302f00370b62d01608546b994557f4f10b6ac06
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
        allowNull: true,
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
    },
    {
      tableName: "users",
    }
  );

  // hash password hook
  User.beforeCreate(async function (user) {
    password = user.password
    let oldEmail = user.email;
    if (user.password) {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password,salt);
      user.email = oldEmail.toLowerCase();
    }
  });

  //HASH PASSWORD ON RESET OR UPDATE OF ACCOUNT INFO
  User.beforeSave(async (user) => {
    let oldEmail = user.email;
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 12);
      user.email = oldEmail.toLowerCase();
    }
  });

  // create jwt token instance
  User.prototype.createJwt = async function () {
<<<<<<< HEAD
    return await jwt.sign({ user_id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
=======
      return await jwt.sign({ user_id: this.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
      });

>>>>>>> 4302f00370b62d01608546b994557f4f10b6ac06
  };

  //COMPARE PASSWWORD INSTANCE
  User.prototype.comparePassword = async function (password) {
    return   await bcrypt.compare(password, this.password);
  };

  return User;
};
