const mysql = require("mysql2");

//Aqui crearemos la conexión de forma segura y cada vez que queramos hacer una query(fuera de este archivo)
// llamaremos a este archivo y no volveremos a escribir este código.

let db = {};

db.createConnection = async () => {
    return new Promise((resolve, reject) => {
        try{
            const mysqlConnection = mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                dateStrings: true,
            });
            mysqlConnection.connect(async function (err) {
                if(err){
                    reject(new Error(err.message));
                }
                resolve(mysqlConnection);
            });
        }catch(err){
            reject(new Error(err.message));
        }
    });
};

db.query = async(sqlQuery, params, type, conn) => {
    return new Promise((resolve, reject) => {
        try{
            conn.query(sqlQuery, params, async(err, result) =>{
                if(!err){
                    switch(type){
                        case "select":
                            resolve(JSON.parse(JSON.stringify(result)));
                            break;
                            case "insert":
                                resolve(parseInt(result.insetId));
                            break;
                            case "update":
                                if(result.affectedRows > 0) resolve(true);
                                else resolve(false);
                                break;
                            case "replace":
                            case "delete":
                                if(result.affectedRows > 0) resolve (true);
                                else resolve(false);
                                break;
                                default:
                                    throw new Error("Query son con incidencias");
                    }
                }else{
                    console.log("Error en query o en base de datos: ", err);
                    reject(new Error(err.message));
                }
            });
        }catch(err){
            reject(new Error(err.message));
        }
    });
};
module.exports = db;