module.exports = (sequelize, DataTypes) => {
    const Followers = sequelize.define(
      "followers",
      {
        
        followerId: {
          type: DataTypes.INTEGER,
        }
      },
      {
        tableName: "followers",
      }
    );
  
    return Followers;
};