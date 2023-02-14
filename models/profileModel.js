// creating User model
module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define(
    "profile",
    {
      Bio: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      website: DataTypes.STRING,
      locaton: DataTypes.STRING,
      github_link: {
        type: DataTypes.STRING,
      },
      twitter_link: {
        type: DataTypes.STRING,
      },
      headerURL: {
        type: DataTypes.STRING,
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
      hidden: (instance, options) => {
        if (options.deactivated === true) {
          return ['website',
          , 'locaton', 'github_link', 'twitter_link',
        'headerURL', 'avatarURL']
        }
      },
      tableName: "profiles",
    }
  );

  return Profile;
};
