
const express = require("express");
const userController= require("../controllers/userControllers");
const {requestContext} = require("../midlewares/authorizationContext")

const userRouter = express.Router();


userRouter.post("/",userController.addUser);  //Registro
userRouter.post("/login",userController.loginUser);  //Login
userRouter.patch("/delete",requestContext, userController.deleteUser);  //Delete
userRouter.patch("/update",requestContext, userController.updateUser); // Actualizar
userRouter.get("/token",requestContext, userController.tokenInfo); // token



module.exports = userRouter;