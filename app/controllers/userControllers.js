const bcrypt = require("bcryptjs")
const dao = require("../services/dao");
const { SignJWT, jwtVerify } = require("jose");

const userController= {};

userController.addUser = async(req, res) => {

    const {name, surname, email, password} = req.body;
    if(!name || !surname || !email || !password) return res.sendStatus(400);

    try{
        const user = await dao.getUserByEmail(email);
        if(user.length > 0) return res.sendStatus(409);
        await dao.addUser(req.body);
        const userAdded = await dao.getUserByEmail(email);
        if(userAdded){
            return res.sendStatus(200);
        }else{
            return res.sendStatus(500);
        }
    }catch(err){
        console.log(err.message);
        throw new Error(err);
    }
};

userController.loginUser = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) return sendStatus(400);

    try{
        const user = await dao.getUserByEmail(email);
        if(user.length === 0) return res.sendStatus(404);
        let compare = bcrypt.compare(password, user[0].password)
        if(compare === false) return res.sendStatus(401);
        const jwtConstructor = new SignJWT({
            id: user[0].id,
            name:user[0].name,
            email: user[0].email,
        });
        const encoder = new TextEncoder();
        const token = await jwtConstructor
        .setProtectedHeader({alg:"HS256", typ:"JWT"})
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(encoder.encode(process.env.JWT_SECRET));
        return res.send({token});
    }catch(err){
        return res.sendStatus(401)
    }
};

userController.deleteUser = async (req, res) =>{
    const {id} = req.params;
    let user = await dao.getUserById(id);
    [user] = user;
    console.log(user);
    if(user.length === 0) return sendStatus(404);
    try{
        const deleteUser = await dao.deleteUser(id);
        if(!deleteUser){
            return res.sendStatus(500)
        } return res.sendStatus(200);
    }catch(err){
        return res.sendStatus(500);
    };
};

userController.updateUser = async(req,res) => {
    const {id}= req.params;
    const {authorization} = req.headers;
    console.log(req.headers);

    if(!authorization) return sendStatus(401);
    if(Object.entries(req.body).length === 0) return res.sendStatus(400);
    const token= authorization.split(" ")[1];

    try{
        const encoder = new TextEncoder();
        const {payload} = await jwtVerify(
            token,
            encoder.encode(process.env.JWT_SECRET)
        );
        console.log(payload);
        if(payload.id !== Number(id)) return res.sendStatus(401);

        const updateUser = await dao.updateUser(id, req.body);
        if(updateUser) return res.sendStatus(200);

    }catch(err){
        console.log(err.message);
        throw new Error(err)
    };
}

userController.verifyToken = async (req, res) => {
    const {id} = req.params
    const { authorization } = req.headers;

    if (!authorization) return res.sendStatus(401);
    const token = authorization.split(" ")[1];
    try {
        const encoder = new TextEncoder();
        const { payload } = await jwtVerify(
            token,
            encoder.encode(process.env.JWT_SECRET)
        );
        res.json({ valid: true });
    } catch (err) {
        console.log(err.message);
        res.json({ valid: false });
    };
}


module.exports = userController;