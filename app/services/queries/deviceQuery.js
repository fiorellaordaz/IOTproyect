const moment = require("moment");
const {Op} = require("sequelize");
const {Devices, Devices_consumption, Device_models, Historic_prices} = require("../../context/context");
const utils = require("../../utils/utils");

const deviceQuery = {};

deviceQuery.getDevTag = async(tag) => {  // buscar si existe algun dispositivos por su referencia
    let tagDevice;
    try{
        tagDevice = await Devices.findOne({ where: { tag:tag } });
        return (tagDevice === null) ? console.log('Not found!') : tagDevice;
    }catch(err){
        throw new Error(err);
    }
};

deviceQuery.getDevById = async(id) => {  // buscar dispositivo por su id
    let idDevice;
    try{
        idDevice = await Devices.findOne({ where: { id:id } });
        return (idDevice === null) ? console.log('Not found!') : idDevice;
    }catch(err){
        throw new Error(err);
    }
};

deviceQuery.findDivByIduser = async(id) => { // buscar todoslos dispositivos que tiene un usuario
    let userId;
    userId = await Devices.findAll({ where: {idUser: id},
    include:[ 
        {model:Device_models, attributes:['images']}, 
        {model:Devices_consumption, as:'device_consumption', 
        attributes:['id'],
        limit: 1,
        order: [['id','DESC']],
    }]
});
    return (userId === null) ? console.log("Not Found") : userId;
};

deviceQuery.getModels = async(variable) =>{
    let model;
    try{
        model = await Device_models.findAll({ where: {variable: variable}});
        return (model === null) ? console.log('Not fund!') : model;
    }catch(err){
        throw new Error(err);
    }
};

deviceQuery.getDevice = async(id) =>{
    let device;
    try{
        device = await Devices.findOne({ where: {id:id}});
        return (device === null) ? console.log('Not found!') : device;
    }catch(err){
        throw new Error(err);
    }
};

deviceQuery.activityNow = async(id) =>{
    let activity;
    try{
        activity = await Devices_consumption.findOne({
            limit:1,
            order: [['lastOn','DESC']],
            where: { idDevice: id },
        });
        return activity;
    }catch(err){
        throw new Error(err);
    }
};

deviceQuery.changeActivity = async(id, state) =>{
    let activity;
    try{
        activity = await Devices.update({
            state:state
        }, {where:{id:id}});
        activity= await utils.removeUndefinedKeys(activity);
        return true;
    }catch(err){
        throw new Error(err);
    }
};

deviceQuery.add_device = async(dataDevice, id) =>{  // añadir un dispositivo
    let add;
    try{
        add = Devices.build({
            name: dataDevice.name,
            tag: dataDevice.tag,
            idUser: id,
            idDevModel: dataDevice.idDevModel,
            registerDate: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
    await add.save();
    return true;
    }catch(err){
        throw new Error(err);
    }
};

deviceQuery.add_image = async(variable, uploadPath) =>{
    let add;
    try{
        add = await Device_models.update({
            images: uploadPath
        }, {where: {variable:variable}});
        add = await utils.removeUndefinedKeys(add);
    }catch(err){
        throw new Error(err);
    }
};

deviceQuery.deleteDevByIduser = async(id, activo) =>{  // eliminar logicamente dispositivo por el id de usuario
    let deleteDiv;
    try{
        deleteDiv = await Devices.update({
            activo:activo
        }, {where:{idUser:id}});
        deleteDiv = await utils.removeUndefinedKeys(deleteDiv);
    }catch(err){
        throw new Error(err);
    }
};

deviceQuery.deleteFisico = async(id) =>{
    let delFisico;
    try{
        delFisico = await Devices.destroy({ where: {id : id}});
        return true;
    }catch(err){
        throw new Error(err)
    }
};
deviceQuery.consumptionDelete = async(id) =>{
    let consumDelete;
    try{
        consumDelete = await Devices_consumption.destroy({where: {id:id}});
        return true

    }catch(err){
        throw new Error(err)
    }
};

deviceQuery.On = async(id, lastOn, idDevModel) =>{ // guardar el encendido de un dispositivo
    let consumptionOn;
    try{
        consumptionOn = Devices_consumption.build({
            idDevice: id,
            lastOn: lastOn,
            idDevModel: idDevModel
        });
        consumptionOn.save();
        return true;
    }catch(err){
        throw new Error(err)
    }
};

deviceQuery.Off = async(id, lastOff) =>{ //actualizar el apagado de un dispositivo
    let deviceConsumption;
    try{
        deviceConsumption = await Devices_consumption.update({
            lastOff: lastOff,
        },
        {where:{ id: id }});
        deviceConsumption = await utils.removeUndefinedKeys(deviceConsumption);
        return true;
    }catch(err){
        throw new Error(err);
    }
};

deviceQuery.getIdDeviceConsumption = async(id)=> {  // encuentra la id del dispositivo en la tabla device_model
    let device;
    try{
        device = await Devices_consumption.findOne({ where: { id: id }});
        const lastOn = device.lastOn;
        const lastOff = device.lastOff;
        return {
            lastOn,
            lastOff
        }
    }catch(err){
        throw new Error(err);
    }
};

deviceQuery.totalHours = async(id, totalTime) =>{ //actualizar las horas de consumo del dispositivo
    let result;
    try{
        result = await Devices_consumption.update({
            totalTime: totalTime,
        },
        {where:{ id: id }});
        result = await utils.removeUndefinedKeys(result);
        return true;
    }catch(err){
        throw new Error(err);
    }
};

deviceQuery.KwhPerHour = async(idDevModel) =>{
    let kwt;
    try{
        kwt = await Device_models.findOne({where: {id:idDevModel}});
        let consumo = kwt.kwh_hour;
        return{
            consumo
        }
    }catch(err){
        throw new Error(err);
    }
};

deviceQuery.KwhTotal = async(id, totalKwh) =>{ //actualizar el consumo total de kwh
    let result;
    try{
        result = await Devices_consumption.update({
            totalKwh: totalKwh,
        },
        {where:{ id:id }});
        result = await utils.removeUndefinedKeys(result);
        return true;
    }catch(err){
        throw new Error(err);
    }
};

deviceQuery.totalMoney = async(dateOn,dateOff, totalConsumptionHours) =>{ //falta poner la fecha de apagado
    let getData;
    const dateOnparse = moment(dateOn.split("-").reverse().join("-")).format('YYYY-MM-DD');
    const dateOffparse = moment(dateOff.split("-").reverse().join("-")).format('YYYY-MM-DD');
    try{
        getData= await Historic_prices.findAll({
            attributes:['precio'],
            where:{
                fecha: {
                    [Op.between]: [dateOnparse,dateOffparse],
                },
            hora:{
                [Op.in]:totalConsumptionHours,
            },
            },
        });
                if(!getData || getData.length === 0){
                    console.log('Not found')
                    return false;
                }else{
                    let totalMoney = 0; 
                    for(const item of getData){
                        totalMoney += item.precio
                    }
                    return totalMoney;
                }
    }catch(err){
        throw new Error(err);
    }
};

deviceQuery.insertMoneyConsumption = async(id, totalMoney) =>{ //actualizar el costo total de la actividad
    let money;
    try{
        money = await Devices_consumption.update({
            totalMoney:totalMoney,
        },
        {where:{ id:id }});
        money = await utils.removeUndefinedKeys(money);
        return true;
    }catch(err){
        throw new Error(err);
    }
};



module.exports = deviceQuery;