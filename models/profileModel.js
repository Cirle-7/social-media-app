// creating User model
module.exports = (sequelize, DataTypes) =>{
    const Profile = sequelize.define('profile',{
        description: {
            bio: {
                type: DataTypes.STRING,
            },
            website: DataTypes.STRING,
            location
        },
        avatarURL: {
            type: DataTypes.STRING,
            allowNull: false
        },
        headerURL:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        // foreign key
        user: {
            type: DataTypes.UUID,
            references: {
                // This is a reference to another model
                model: User,
                // This is the column name of the referenced model
                key: 'userId',
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },{
        tableName: 'profiles' 
    });

    return Profile;
}