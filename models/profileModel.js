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
          return this.isdeactivated ?  null : this.getDataValue('website')
        }
      },
      location: {
        type: DataTypes.STRING,
        get() {
          return this.isdeactivated ?  null : this.getDataValue('location')
        }
      },
      github_link: {
        type: DataTypes.STRING,
        get() {
          return this.isdeactivated ?  null : this.getDataValue('github_link')
        }
      },
      twitter_link: {
        type: DataTypes.STRING,
        get() {
          return this.isdeactivated ?  null : this.getDataValue('twitter_link')
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


