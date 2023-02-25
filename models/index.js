const {
  DB_DIALECT,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_USER,
  SSL,
} = require("../config/db.config");
const { Sequelize } = require("sequelize");

// import the models here
const userModel = require("./userModel");
const postModel = require("./postModel");
const profileModel = require("./profileModel");
const commentModel = require("./commentModel");
const commentCommentModel = require("./comment-commentModel");
const followersModel = require("./followersModel");
const blockedAccountsModel = require("./blockedAccountsModel");
const likesModel = require("./likesModel");

const logger = require("./../utils/logger");

// connect to Database
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  // dialectOptions: {
  //   ssl: {
  //     SSL
  //   }
  // }
});

// add the models to db Object so it can be called when you import db
const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.users = userModel(sequelize, Sequelize.DataTypes);
db.profile = profileModel(sequelize, Sequelize.DataTypes);
db.post = postModel(sequelize, Sequelize.DataTypes);
db.comments = commentModel(sequelize, Sequelize.DataTypes);
db.commentsComments = commentCommentModel(sequelize, Sequelize.DataTypes);
db.followers = followersModel(sequelize, Sequelize.DataTypes);
db.blockedAccounts = blockedAccountsModel(sequelize, Sequelize.DataTypes);
db.likes = likesModel(sequelize, Sequelize.DataTypes);

// creating  associations with tables joining tables together
(function createAssociations() {
  let User = db.users
  let Profile = db.profile
  let Posts = db.post
  let comments = db.comments
  let commentsComments = db.commentsComments
  let followers = db.followers
  let blockedAccount = db.blockedAccounts
  let likes = db.likes
  // create a userid in the post table
  User.hasMany(Posts, {
    onDelete: 'CASCADE',
  });     // link posts to their user
  Posts.belongsTo(User);

  // create a userId in the comment table
  User.hasMany(comments, {
    onDelete: 'CASCADE',
  });     // link comments to their user
  comments.belongsTo(User)

  //create a userid in the  profile table 
  User.hasOne(Profile, {
    onDelete: 'CASCADE'
  })      // link a user to a profile
  Profile.belongsTo(User)

  // create a postId in the comment table

  Posts.hasMany(comments);
  comments.belongsTo(Posts);

  // create a comment id in the comment_comment table
  comments.hasMany(commentsComments);
  commentsComments.belongsTo(comments);

  // create a userId in the commentComments table
  User.hasMany(commentsComments); // link commentsComments to their user
  commentsComments.belongsTo(User);

  // // create a userId in the followers table
  User.hasMany(followers);
  followers.belongsTo(User);

  // create association between blockedUsers and users
  User.hasMany(blockedAccount); //, { foreignKey: 'blockedBy'})
  blockedAccount.belongsTo(User); //, { as: 'blockedUserId', foreignKey: 'blockedUser'})

  // CREATE ASSOCIATION BETWWEN LIKES AND USER
  User.hasMany(likes);
  likes.belongsTo(User);

  Posts.hasMany(likes);
  likes.belongsTo(Posts);

  comments.hasMany(likes)
  likes.belongsTo(comments)

  commentsComments.hasMany(likes)
  likes.belongsTo(commentsComments)

})();

// checking  if the connection is successfull
sequelize
  .authenticate()
  .then(() => logger.info("database connected successfuly"))
  .catch((err) => logger.error("unable to connect", err));

// sync the table
db.sequelize
  .sync({ force: false })
  // .sync({ alter: true})
  .then(() => logger.info("table sync successful"))
  .catch((err) => logger.error(err));

module.exports = db;
