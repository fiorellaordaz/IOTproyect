const { SignJWT, jwtVerify } = require("jose");

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

// utils.verifyToken = async (id, authorization) => {

//     if (!authorization) return res.sendStatus(401);
//     const token = authorization.split(" ")[1];
//     try {
//         const encoder = new TextEncoder();
//         const { payload } = await jwtVerify(
//             token,
//             encoder.encode(process.env.JWT_SECRET)
//         );
//         if(payload.id !== id) return true;
//     } catch (err) {
//         console.log(err.message);
//         throw new Error(err);
//     };
// };

module.exports = utils;