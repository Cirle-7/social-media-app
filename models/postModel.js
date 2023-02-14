module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "post",
    {
      body: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      media_url: {
        type: DataTypes.STRING,
      },
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["Draft", "Published"],
        defaultValue: "Published"
      },
      commentsNo: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      shares: {
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
    },
    {
      tableName: "posts",
    }
  );
  return Post
};
