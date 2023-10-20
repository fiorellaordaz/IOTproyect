const {Historic_prices} = require("../../context/context");

const dataQuery = {};

dataQuery.addPrices_control = async(dataPrice) => {
    let data;
    try{
        data = await Historic_prices.create({
        fecha: new Date(dataPrice.date.split("-").reverse().join("-")),
        hora: dataPrice.hour,
        precio: dataPrice.price, 
        });
    }catch(err){
        throw new Error(err);
    }
};

module.exports= dataQuery;
