const {DB_DIALECT, DB_HOST, DB_NAME, DB_PASSWORD, DB_USER} = require('../config/db.config')
const {Sequelize} = require('sequelize')
const userModel = require('./userModel')


// connect to localbase
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD,{
    host:DB_HOST,
    dialect:DB_DIALECT
})

const db = {
}

db.sequelize = sequelize
db.Sequelize = Sequelize
db.user = userModel(sequelize,Sequelize.DataTypes)


// check if the connection is successfull
sequelize.authenticate()
.then(()=>console.log('database connected successfuly'))
.catch((err)=>console.log('unable to connect',err))


// sync the table
db.sequelize.sync({true:false})
.then(()=>console.log('table sync successful'))
.catch((err)=>console.log(err))

module.exports = db;
