module.exports = (sequelize, DataTypes) => {
    const Following = sequelize.define(
      "following",
      {
        follower_id: {
          type: DataTypes.INTEGER
        },
        following_id: {
          type: DataTypes.INTEGER
        }
      },
      {
        tableName: "following",
      }
    );
  
    return Following;
};