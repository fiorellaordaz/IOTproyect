const express = require("express");
const {deviceController} = require("../controllers/deviceControllers");
const {requestContext} = require("../midlewares/authorizationContext")

const deviceRouter = express.Router();


deviceRouter.post("/",requestContext,deviceController.switchDevice);
deviceRouter.post("/dev",requestContext, deviceController.add_device); // agregar dispositivo
deviceRouter.get("/findDev",requestContext, deviceController.findAllDevices); // encontar dispositivos con el mismo idUser
deviceRouter.post("/model",deviceController.totalmodels); // enviar catalogo de dispositivos
deviceRouter.delete("/delete",requestContext,deviceController.delete_divice); // eliminar dispositivo
deviceRouter.patch("/uploadImage",deviceController.addImage); // subir imagen

module.exports = deviceRouter;