const { DataTypes, Model} = require("sequelize");
const sequelize = require("./db");

class Users extends Model {};
Users.init({
    id:{
        type: DataTypes.INTEGER,
        allowNull: false, 
        autoIncrement: true, 
        primaryKey:true 
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
    role_name: {
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

class Prices_control extends Model {};
Prices_control.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    date:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    hour:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    price:{
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
},{
    sequelize,
    modelName: 'Prices_control',
    timestamps: false,
    freezeTableName: true
});

class Dispositivos extends Model {};
Dispositivos.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        allowNull: false,
    },
    name:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    
})


Role.hasMany(Users, {as:'user', foreignKey:'idRole'});
Users.belongsTo(Role,{foreignKey:'idRole'});


module.exports = {Users, Role, Prices_control};