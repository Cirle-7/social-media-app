const { STRING, NUMBER } = require("sequelize");


// creating User model
module.exports = (sequelize, DataTypes) => {
  
  const Profile = sequelize.define(
    "profile",
    {
      Bio: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      website: {
        type: DataTypes.STRING,
        get() {
          if (this.isdeactivated === true) {
            return null}
          else{ return this.getDataValue('website');}
        }
      },
      locaton: {
        type: DataTypes.STRING,
        get() {
          if (this.isdeactivated === true) {
            return null}
          else{ return this.getDataValue('locaton');}
        }
      },
      github_link: {
        type: DataTypes.STRING,
        get() {
          if (this.isdeactivated === true) {
            return null}
          else{ return this.getDataValue('github_link');}
        }
      },
      twitter_link: {
        type: DataTypes.STRING,
        get() {
          if (this.isdeactivated === true) {
            return null}
          else{ return this.getDataValue('twitter_link');}
        }
      },
      headerURL: {
        type: DataTypes.STRING
      },
      avatarURL: {
        type: DataTypes.STRING,
      },
      followers: {
        type: DataTypes.STRING,
      },
      isdeactivated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      deactivationToken: DataTypes.STRING,
      deactivationTokenExpires: DataTypes.DATE
    },
    {
      tableName: "profiles",
    }
  );

  return Profile;
};


