const httpContext = require("express-http-context");
const summaryActDevQuery = require("../services/queries/summaryActDevQuery");


const summaryActDevControllers = {};


summaryActDevControllers.consumptionAllDevices = async(req, res) =>{
    let user = httpContext.get('user');
    try{
        const consumption = await summaryActDevQuery.getConsumptionDevs(user);
        if (!consumption) return res.sendStatus(400);
        const moneyConsumption = await summaryActDevQuery.moneyConsumptionDevs(user);
        return (moneyConsumption) ? res.json({consumption,moneyConsumption}) : res.sendStatus(400);
    }catch(err){
        throw new Error(err)
    }
};




module.exports = summaryActDevControllers;