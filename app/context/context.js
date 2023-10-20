const { DataTypes, Model} = require("sequelize");
const sequelize = require("./db");

class Users extends Model {};
Users.init({
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true, 
        primaryKey:true,
        allowNull: false, 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    }, 
    surname: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false 
      // allowNull defaults to true 
    }, 
    password:{ 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    idRole:{ 
        type: DataTypes.INTEGER, 
        allowNull: true,
    },
    activo:{
        type:DataTypes.STRING,
        allowNull: true,
    },
    registerDate:{ 
        type: DataTypes.DATE, 
        allowNull: true 
    },
    modificationDate:{ 
        type: DataTypes.DATE, 
        allowNull: true 
    },
},{
    sequelize,
    modelName: 'Users',
    timestamps: false,
    freezeTableName: true
});

class Role extends Model {}
Role.init({
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull:false
    },
    name: {
        type: DataTypes.STRING,
        allowNull:false
    },
    codigo:{
        type: DataTypes.STRING,
        allowNull:false
    },
},{
    sequelize,
    modelName: 'Role',
    timestamps: false,
    freezeTableName: true
});

class Historic_prices extends Model {};
Historic_prices.init({
    hora:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    precio:{
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
    fecha:{
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
},{
    sequelize,
    modelName: 'Historic_prices',
    timestamps: false,
    freezeTableName: true
});
Historic_prices.removeAttribute('id');

class Devices extends Model {};
Devices.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        allowNull: false,
    },
    idUser:{
        type: DataTypes.INTEGER,
        allowNull:true,
    },
    idDevModel:{
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    name:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    tag:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    activo:{
        type:DataTypes.STRING,
        allowNull: true,
    },
    state:{
        type:DataTypes.STRING,
        allowNull: true,
    },
    registerDate:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    modificationDate:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    
},{
    sequelize,
    modelName: 'Devices',
    timestamps: false,
    freezeTableName: true
});

class Devices_consumption extends Model {}
Devices_consumption.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        allowNull: false,
    },
    lastOn:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    lastOff:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    totalTime:{
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    totalKwh:{
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    idDevModel:{
        type: DataTypes.INTEGER,
        allowNull:true,
    },
    idDevice:{
        type: DataTypes.INTEGER,
        allowNull:true,
    },
    totalMoney:{
        type: DataTypes.DECIMAL,
        allowNull:true,
    },
},{
    sequelize,
    modelName: 'Devices_consumption',
    timestamps: false,
    freezeTableName: true,
});

class Device_models extends Model{}
Device_models.init({
    id:{
        type: DataTypes.INTEGER,
        allowNull:false,
        autoIncrement: true,
        primaryKey: true,
    },
    variable:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    brand:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    model:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    kwh_hour:{
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    images:{
        type: DataTypes.STRING,
        allowNull: true,
    },
},{
    sequelize,
    modelName: 'Device_models',
    timestamps: false,
    freezeTableName: true,
});

class Task extends Model{};
Task.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true
    },
    idDevice:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    programTime:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    operationType:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    status:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    idDevModel:{
        type: DataTypes.STRING,
        allowNull: true,
    },
},{
    sequelize,
    modelName: 'Task',
    timestamps: false,
    freezeTableName: true,
});


Role.hasMany(Users, {as:'user', foreignKey:'idRole'});
Users.belongsTo(Role,{foreignKey:'idRole'});

Users.hasMany(Devices, {as:'devices', foreignKey: 'idUser'});
Devices.belongsTo(Users,{foreignKey:'idUser'}); // preguntar por esta relacion

Device_models.hasMany(Devices, {as: 'devices', foreignKey: 'idDevModel'});
Devices.belongsTo(Device_models, {foreignKey:'idDevModel'});

Devices.hasMany(Devices_consumption, {as: 'device_consumption', foreignKey: 'idDevice'});
Devices_consumption.belongsTo(Devices, {foreignKey:'idDevice'});

Device_models.hasMany(Devices_consumption, {as:'devices_consumption', foreignKey: 'idDevModel'});
Devices_consumption.belongsTo(Device_models, {foreignKey:'idDevModel'});



module.exports = {Users, Role, Historic_prices, Devices, Devices_consumption, Device_models, Task};