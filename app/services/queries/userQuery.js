const db = require("../mysql");
const md5 = require("md5");
const utils = require("../../utils/utils");

const userQuery = {};

userQuery.getUserByEmail = async (email) => {
    let conn = null;
    try{
        conn = await db.createConnection();
        return await db.query(
            "SELECT * FROM users WHERE email = ?", email, "select", conn
        );
    }catch(err){
        throw new Error(err);
    }finally{
        conn && await conn.end();
    }
};

userQuery.addUser = async(userData) => {

    let conn = null;
    try{
        conn = await db.createConnection();
        let userObj ={
            name:userData.name,
            surname:userData.surname,
            email:userData.email,
            password:md5(userData.password)
        };
        return await db.query( "INSERT INTO users SET ?", userObj, "insert", conn );
    }catch(err){
        throw new Error(err);
    }finally{
        conn && await conn.end();
    }
};

userQuery.getUserById = async (id) => {
    let conn = null;
    try{
        conn = await db.createConnection();
        return await db.query("SELECT * FROM users WHERE id= ?", id, "select", conn
        );
    }catch(err){
        throw new Error(err)
    }finally{
        conn && await conn.end();
    }
};

userQuery.deleteUser = async (id) => {
    let conn = null;
    try{
        conn = await db.createConnection();
        return await db.query(
            "DELETE FROM users WHERE id = ?", id, "delete", conn
        );
    }catch(err){
        throw new Error(err)
    }finally{
        conn && await conn.end();
    }
};

userQuery.updateUser = async (id, userData) => {
    let conn = null;
    try{
        conn = await db.createConnection();
        let userObj={
            name: userData.name,
            surname: userData.surname,
            email: userData.email,
            password: userData.password? md5(userData.password):undefined,
        }
        console.log(userObj);
        userObj = await utils.removeUndefinedKeys(userObj);
        return await db.query("UPDATE users SET ? where id = ?", [userObj, id], "update", conn);
    }catch(err){
        console.log(err.message);
        throw new Error(err);
    }finally{
        conn && await conn.end();
    }
}



module.exports = userQuery;