const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userControllers");

userRouter.post("/",userController.addUser);  //Registro
userRouter.post("/login",userController.loginUser);  //Login
userRouter.delete("/:id", userController.deleteUser);  //Delete
userRouter.patch("/:id",userController.updateUser); // Actualizar

module.exports = userRouter;