const express = require("express");
const devControlControllers = require("../controllers/devControlControllers");

const devControlRoute = express.Router();

devControlRoute.post("/programDev",devControlControllers.devProgramActivity);
devControlRoute.get("/deviceConfiguration",devControlControllers.getDeviceConfiguration);



module.exports = devControlRoute;