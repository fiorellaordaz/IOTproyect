
const {Sequelize} = require("sequelize")


const sequelize = new Sequelize('EnergyWise', 'energywiseadmin', 'Tugemijj92', {
    host: 'energywise.database.windows.net',
    dialect: 'mssql',
    port:'1433'
});


module.exports= sequelize;