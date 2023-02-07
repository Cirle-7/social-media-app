module.exports = (sequelize, DataTypes) => {
    const Followers = sequelize.define(
      "followers",
      {
        follower_id: {
          type: DataTypes.INTEGER,
        },
        following_id: {
          type: DataTypes.INTEGER,
        }
      },
      {
        tableName: "followers",
      }
    );
  
    return Followers;
};