module.exports = (sequelize, DataTypes) => {
    const Followers = sequelize.define(
      "followers",
      {
        
        followeeId: {
          type: DataTypes.INTEGER,
        }
      },
      {
        tableName: "followers",
      }
    );
  
    return Followers;
};