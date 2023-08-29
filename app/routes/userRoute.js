
const express = require("express");
const userController= require("../controllers/userControllers");

const userRouter = express.Router();


userRouter.post("/",userController.addUser);  //Registro
userRouter.post("/login",userController.loginUser);  //Login
userRouter.delete("/:id", userController.deleteUser);  //Delete
userRouter.patch("/:id",userController.updateUser); // Actualizar
userRouter.get("/info", userController.tokenInfo);  // desestructurar Token



module.exports = userRouter;