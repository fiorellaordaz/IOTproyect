const {Op} = require("sequelize");
const {Historic_prices, Task} = require("../../context/context");
const utils = require("../../utils/utils");
const sequelize = require("sequelize");
const moment = require("moment");

const devControlQuery = {};

devControlQuery.findLastDate= async(start,end) =>{// esta query esta para la regresion
    let active
    try{
    active = await Historic_prices.findAll({
    attributes: [
        [sequelize.fn('CONVERT', sequelize.literal('DATE'), sequelize.col('fecha')),
            'fecha'],
            'hora',
            'precio'
        ],
        where: {
        fecha: {
            [Op.between]: [start, end]
        }
        },
        group: [sequelize.fn('CONVERT', sequelize.literal('DATE'), sequelize.col('fecha')), 'hora', 'precio'],
        order: [
        [sequelize.fn('CONVERT', sequelize.literal('DATE'), sequelize.col('fecha')), 'ASC']
        ]
    });
    return active;
    }catch(err){
        throw new Error(err);
}
};

devControlQuery.insertActivity = async(data) =>{//cuando el front envie la info, la inserto en la tabla.
    let activity;
    let convert = moment(data.programTime, "YYYY-MM-DD HH:mm:ss.SSS").toDate();
    console.log(typeof(convert));
    console.log(convert);
    try{
        activity = Task.build({
            programTime: convert,
            idDevice: data.idDevice,
            operationType: data.operationType,
            idDevModel: data.idDevModel
        });
    await activity.save();
    return true;
    }catch(err){
        throw new Error(err)
    }
};

devControlQuery.findActivity = async(time, time30) =>{
    let findData;
    try{
        findData = await Task.findAll({
            where: {
                programTime: {
                    [Op.between]: [time, time30],
                }}});
        return findData;
    }catch(err){
        throw new Error(err)
    }
};

devControlQuery.updateCompleteTask = async(id, status) =>{ // una vez realizada la tarea se actualiza este campo
    let change;
    try{
        change = await Task.update({
            status: status
        },
        {where: {id:id} });
        change = await utils.removeUndefinedKeys(change);
        return true;
    }catch(err){
        throw new Error(err);
    }
};

devControlQuery.findStatus = async(task) =>{ // me ayuda a comprobar si la tarea esta realizada para asi poder continuar con el codigo
    let find;
    try{
        find = await Task.findOne({ where: {status:task} });
        return (find === null) ? console.log('Not found') : find;
    }catch(err){
        throw new Error(err);
    }
};

devControlQuery.findTask = async(id) =>{
    let findTask;
    try{
        findTask = await Task.findAll({ where: {idDevice: id}});
        return (findTask === null) ? console.log('Not found') : findTask;
    }catch(err){
        throw new Error(err)
    }
};

module.exports = devControlQuery;