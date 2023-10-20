// const {jwtVerify} = require("jose");



// const userAuthorization = async(authorization) => {
//     try {
//         const token = authorization.split(" ")[1];
//         const encoder = new TextEncoder();
//         const { user } = await jwtVerify(
//             token,
//             encoder.encode(process.env.JWT_SECRET)
//         );
//         if(user) return true;
//         console.log(user);
//     } catch (err) {
//         throw new Error(err);
//     };
// };

// module.exports = userAuthorization;