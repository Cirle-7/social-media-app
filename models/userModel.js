
// creating User model
module.exports = (sequelize, DataTypes) =>{
    const User = sequelize.define('user',{
        username: DataTypes.STRING,
        password:DataTypes.STRING
    });

    return User;
}