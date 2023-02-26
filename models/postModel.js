module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "post",
    {
      body: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      topic: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      media_url: {
        type: DataTypes.JSON,
      },
      likesNo: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      status:{
        type:DataTypes.ENUM,
        values:["Draft", "Published"],
        defaultValue: "Draft"
      },
      commentsNo: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      tags: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "posts",
    }
  );
  return Post;
};


