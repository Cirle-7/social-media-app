const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
require('dotenv').config()

// creating User model
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      googleId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      githubId: {
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
        allowNull: true,
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "users",
    },
  );

  
// hash password hook
  User.beforeCreate(async function(user){
    let oldEmail = user.email
    // If Not Social Auth
    if(user.password) user.password = await bcrypt.hash(user.password,12);
    user.email = oldEmail.toLowerCase()
  });


// create jwt token instance
User.prototype.createJwt = async function(){
  return await jwt.sign({user_id: this._id},process.env.JWT_SECRET, {expiresIn:process.env.JWT_ExPIRES})
}

// create a compare password instance

User.prototype.comparePassword = async function(password){
 return await bcrypt.compare(password, this.password);

}

  return User;
};
