module.exports = (sequelize, DataTypes) => {
    const Followers = sequelize.define(
      "followers",
      {
        
        followeeId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          }
        }
      },
      {
        tableName: "followers",
      }
    );
  
    return Followers;
};