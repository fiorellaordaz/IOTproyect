
const bcrypt = require("bcryptjs");
const { SignJWT, jwtVerify } = require("jose");
const userQuery = require("../services/queries/userQuery");
const deviceQuery = require("../services/queries/deviceQuery");
const httpContext = require("express-http-context");


const userController= {};

userController.addUser = async(req, res) => {
    const {name, surname, email, password} = req.body;
    if(!name || !surname || !email || !password) return res.sendStatus(409);

    try{
        const existingUser = await userQuery.getUserByEmail(email);
        if(existingUser) return res.sendStatus(409);
        await userQuery.addUser(req.body);
        const user = await userQuery.getUserByEmail(email);
        return (user) ? res.sendStatus(201) : res.sendStatus(404);
    }catch(err){
        console.log(err.message);
        throw new Error(err);
    }
};

userController.loginUser = async (req, res) =>{
    const {email, password} = req.body;
    if(!email || !password) return res.sendStatus(409);

    try{
        const user = await userQuery.getUserByEmail(email);
        if(user.activo != process.env.ACTIVO) return res.sendStatus(403);
        let verifyPass = await bcrypt.compare(password, user.password)
        if(verifyPass === false) return res.sendStatus(401);
        const jwtConstructor= new SignJWT({
            id: user.id,
            name:user.name,
            surname: user.surname,
            email: user.email,
            activo: user.activo,
        });
        const encoder= new TextEncoder();
        const token = await jwtConstructor
        .setProtectedHeader({alg:"HS256", typ:"JWT"})
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(encoder.encode(process.env.JWT_SECRET));
        return res.send({token});
    }catch(err){
        console.log(err.message);
        return res.sendStatus(401);
    }
};

userController.deleteUser = async (req, res) => {
    let user = httpContext.get("user"); // aca debo pedir la id del modelo que tiene para enviarle la foto que corresponde.
    try{
        await deviceQuery.deleteDevByIduser(user, process.env.INACTIVO);
        await userQuery.deleteUser(user, process.env.INACTIVO);
        return res.sendStatus(200);
    }catch(err){
        throw new Error(err);
    }
};

userController.updateUser = async(req, res) =>{
    let userFind = httpContext.get("user");
    const {email} = req.body;
    try{ 
            const user = await userQuery.getUserById(userFind);
            if(email && user.email !== email){
                const newUserEmail = await userQuery.getUserByEmail(email);
            if(newUserEmail) return res.sendStatus(409);
            }
            await userQuery.updateUser(userFind, req.body);
            const updateUser = await userQuery.getUserById(userFind);
            return (updateUser) ? res.json(updateUser) : res.sendStatus(500);
    }catch(err){
        console.log(err.message);
        throw new Error(err);
    }
};

userController.tokenInfo = async (req, res) => {
    let userFind = httpContext.get("user");
    try {
        const user= await userQuery.getUserById(userFind);
        if(user){
            res.json({
                name: user.name,
                surname: user.surname,
                email: user.email
            });
        } else{
            res.sendStatus(404);
        }
    } catch (err) {
        throw new Error(err);
    };
};

module.exports = userController;