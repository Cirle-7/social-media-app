module.exports= (sequelize, DataTypes)=>{
    const CommentComment = sequelize.define('commentComment',{
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
            tableName: 'commentComments' 
        }
    )

    return CommentComment
}