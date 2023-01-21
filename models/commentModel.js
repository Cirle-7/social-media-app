module.exports= (sequelize, DataTypes)=>{
    const Comment = sequelize.define('comment',{
        body:{
            type: DataTypes.STRING,
            allowNull:false
        },
        media_url:{
            type:DataTypes.STRING,
        },
        likes:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        comments:{
            type: DataTypes.INTEGER,
            defaultValue:0
        },
    },
        {
            tableName: 'comments' 
        }
    )

    return Comment
}