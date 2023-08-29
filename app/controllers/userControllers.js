
const bcrypt = require("bcryptjs");
const { SignJWT, jwtVerify } = require("jose");
const userQuery = require("../services/queries/userQuery");
const utils = require("../utils/utils");


const userController= {};

userController.addUser = async(req, res) => {
    const {name, surname, email, password} = req.body;
    if(!name || !surname || !email || !password) return res.sendStatus(409);

    try{
        const existingUser = await userQuery.getUserByEmail(email);
        if(existingUser){
            return res.sendStatus(409);
        } 
        await userQuery.addUser(req.body);
        const user = await userQuery.getUserByEmail(email);
        if(user){
        return res.sendStatus(201);
        } else{
        return res.sendStatus(404);
        }
    }catch(err){
        console.log(err.message);
        throw new Error(err);
    }
};

userController.loginUser = async (req, res) =>{
    const {email, password} = req.body;
    if(!email || !password) return res.sendStatus(401);

    try{
        const user = await userQuery.getUserByEmail(email);
        if(!user) return res.sendStatus(404);
        let verifyPass = await bcrypt.compare(password, user.password)
        if(verifyPass === false) return res.sendStatus(401);
        const jwtConstructor= new SignJWT({
            id: user.id,
            name:user.name,
            surname: user.surname,
            email: user.email
        });
        const encoder= new TextEncoder();
        const token = await jwtConstructor
        .setProtectedHeader({alg:"HS256", typ:"JWT"})
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(encoder.encode(process.env.JWT_SECRET));
        return res.send({token});
    }catch(err){
        console.log(err.message);
        return res.sendStatus(401);
    }
};

userController.deleteUser = async (req, res) => {
    const {id} = req.params;
    const {authorization} = req.headers;

    let user = await userQuery.getUserById(id);
    if(user === await utils.verifyToken(id, authorization)) return res.sendStatus(404);
    try{
        const deletteUser = await userQuery.deleteUser(id);
        if(!deletteUser){
            return res.sendStatus(500);
        } else{
            return res.sendStatus(200);
        }
    }catch(err){
        throw new Error(err);
    }
};

userController.updateUser = async(req, res) =>{
    const {id} = req.params;
    const {email} = req.body;
    const {authorization} = req.headers;
    
    if(!authorization) return sendStatus(401);
    if(Object.entries(req.body).length === 0) return res.sendStatus(400);
    const token = authorization.split(" ")[1];
    
    try{ 
        const encoder = new TextEncoder();
        const { payload } = await jwtVerify(
            token,
            encoder.encode(process.env.JWT_SECRET));
            console.log(payload);
            const user = await userQuery.getUserById(id);
            
            if(email && user.email !== email){
                const newUserEmail = await userQuery.getUserByEmail(email);
            if(newUserEmail) return res.sendStatus(409);
            }
            
            if(payload.id !== Number(id)) return res.sendStatus(401);
            
            await userQuery.updateUser(id, req.body);
            const updateUser = await userQuery.getUserById(id);
            if(updateUser){
                return res.json(updateUser);
            } else{
                return res.sendStatus(500);
            }
            
                
    }catch(err){
        console.log(err.message);
        throw new Error(err);
    }
};

userController.tokenInfo = async (req, res) => {
    const { authorization } = req.headers;

    if (!authorization) return res.sendStatus(401);
    const token = authorization.split(" ")[1];
    try {
        const encoder = new TextEncoder();
        const { payload } = await jwtVerify(
            token,
            encoder.encode(process.env.JWT_SECRET)
        );
        const user= await userQuery.getUserById(payload.id);
        if(user){
            res.json({
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email
            });
        } else{
            res.sendStatus(404);
        }
    } catch (err) {
        console.log(err.message);
        throw new Error(err);
    };
};


module.exports = userController;