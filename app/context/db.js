
const {Sequelize} = require("sequelize")


const sequelize = new Sequelize('energyWise', 'root', 'malaga01', {
    host: 'localhost',
    dialect: 'mysql',
    port:'3306'
});


module.exports= sequelize;