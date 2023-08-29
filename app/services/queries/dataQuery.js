const {Prices_control} = require("../../context/context");

const dataQuery = {};

dataQuery.addPrices_control = async(dataPrice) => {
    let data;
    try{
        data = await Prices_control.build({
        date: dataPrice.date,
        hour: dataPrice.hour,
        price: dataPrice.price/1000
        });
        console.log(data);
        await data.save();
    }catch(err){
        throw new Error(err);
    }
};

// dataQuery.add = async (dataPrice) =>{

//     let conn = null;
//     try{
//         conn = await db.createConnection()
//         const dataObj={
//             date: dataPrice.date,
//             hour: parseFloat(dataPrice.hour),
//             price: dataPrice.price/1000
//         }
//         console.log(dataObj);
//         return await db.query("INSERT INTO prices_control SET ? ORDER BY (hour) ASC", dataObj, "insert, ", conn);
//     }catch(err){
//         throw new Error(err);
//     }finally{
//         conn && await conn.end();
//     }
// }

module.exports= dataQuery;
