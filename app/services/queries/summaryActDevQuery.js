const {Devices_consumption, Devices} = require("../../context/context");
const sequelize = require("../../context/db");

const summaryActDevQuery = {};

summaryActDevQuery.getConsumptionDevs = async(idUser) =>{
    try{
        const summary = await Devices.findAll({
            where: { idUser: idUser },
            include: [{
            model: Devices_consumption,
            as: 'device_consumption',
            attributes: [
                'idDevice',
                [sequelize.literal('(SELECT SUM(totalKwh) FROM devices_consumption WHERE device_consumption.idDevice = idDevice)'), 'totalKwh'] // Sumar totalKwh por dispositivo
            ],
            group: ['device_consumption.idDevice']
            }],
            raw: true
        });
        return summary;
    }catch(err){
        throw new Error(err);
    }
}; 

summaryActDevQuery.moneyConsumptionDevs = async(idUser) =>{
    try{
        const summary = await Devices.findAll({
            where: { idUser: idUser },
            include: [{
            model: Devices_consumption,
            as: 'device_consumption',
            attributes: [
                'idDevice',
                [sequelize.literal('(SELECT SUM(totalMoney) FROM devices_consumption WHERE device_consumption.idDevice = idDevice)'), 'totalMoney']
            ],
            group: ['device_consumption.idDevice']
            }],
            raw: true
        });
        return summary;
    }catch(err){
        throw new Error(err);
    }
}; 


module.exports = summaryActDevQuery;