

const utils = {};

utils.removeUndefinedKeys = async (obj) => {
    try{
        Object.keys(obj).forEach((Key) => {
            if(obj[Key] === -1 || obj[Key] === "-1"){
                obj[Key] = null;
            }else if(obj[Key] === undefined || obj[Key] === ""){
                delete obj[Key];
            }
        });
        return obj;
    }catch(err){
        throw new Error(err.message);
    }
};

module.exports = utils;