module.exports = (sequelize, DataTypes)=>{

 const Likes = sequelize.define(
  "like",
  {

 },
 {
  tableName: "likes",
}
);

 return Likes;
};