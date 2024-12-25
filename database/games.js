const sequelize = require('sequelize')
const connection = require('./database')

const games = connection.define('games', {
    id:{
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    title:{
        type: sequelize.STRING(100),
        allowNull: false
    },
    year:{
        type: sequelize.INTEGER,
        allowNull: true
    },
})

games.sync({force: false}).then(()=> {
    console.log("Tabela de usuarios criada!")
})

module.exports = games;