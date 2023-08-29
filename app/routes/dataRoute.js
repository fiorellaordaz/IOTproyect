
const express= require("express");
const dataController= require("../controllers/dataControllers");
const dataRouter = express.Router();


dataRouter.get("/",dataController.allData); //todos los precios
dataRouter.get("/prices", dataController.electricPrice);  // precios




module.exports = dataRouter;