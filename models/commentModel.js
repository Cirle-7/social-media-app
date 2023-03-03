module.exports= (sequelize, DataTypes)=>{
    const Comment = sequelize.define('comment',{
        body:{
            type: DataTypes.STRING,
            allowNull:false
        },
        media_url:{
            type:DataTypes.JSON,
        },
        likesNo:{
            type:DataTypes.INTEGER,
            defaultValue:0
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
    },
        {
            tableName: 'comments' 
        }
    )

    return Comment
}