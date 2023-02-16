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
      location: DataTypes.STRING,
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
    },
    {
      tableName: "profiles",
    }
  );

  return Profile;
};
