const express = require("express");
const {requestContext} = require("../midlewares/authorizationContext")
const summaryActDevControllers = require("../controllers/summaryActDevControllers")


const summaryActDevRouter = express.Router();

summaryActDevRouter.get("/consumptionDevs",requestContext, summaryActDevControllers.consumptionAllDevices);


module.exports = summaryActDevRouter;