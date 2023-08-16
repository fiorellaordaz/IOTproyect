const express = require("express");
const dataController = require("../controllers/dataControllers");

 const dataRouter = express.Router();

dataRouter.get("/",dataController.allData);





 module.exports = dataRouter;