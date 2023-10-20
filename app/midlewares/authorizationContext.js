// analizar esto 

const httpContext = require("express-http-context");
const {jwtVerify} = require("jose");

async function requestContext(req,res,next) {
        try {
            const token = req.get("Authorization").split(" ")[1];

            const encoder = new TextEncoder();
            const  {payload}  = await jwtVerify(
                token,
                encoder.encode(process.env.JWT_SECRET)
            );
        httpContext.set("user", payload.id);
    } catch (err) {
        throw new Error(err);
    }
    next();
}



module.exports = {requestContext};