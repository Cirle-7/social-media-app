// creating User model
module.exports = (sequelize, DataTypes) =>{
    const User = sequelize.define('user',{
        userId: {
            type: DataTypes.UUID,
            unique: true,
            primaryKey: true
        }, 
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        displayName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },{
        tableName: 'users' 
    });

    return User;
}