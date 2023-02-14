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
          if (this.deactivated === true) return 'NA'
        }
      },
      locaton: {
        type: DataTypes.STRING,
        get() {
          if (this.deactivated === true) return 'NA'
        }
      },
      github_link: {
        type: DataTypes.STRING,
        get() {
          if (this.deactivated === true) return 'NA'
        }
      },
      twitter_link: {
        type: DataTypes.STRING,
      },
      headerURL: {
        type: DataTypes.STRING,
        get() {
          if (this.deactivated === true) return 'NA'
        }
      },
      avatarURL: {
        type: DataTypes.STRING,
      },
      followers: {
        type: DataTypes.STRING,
      },
      deactivated: {
        type: DataTypes.BOOLEAN,
        default: false
      }
    },
    {
      tableName: "profiles",
    }
  );

  return Profile;
};
