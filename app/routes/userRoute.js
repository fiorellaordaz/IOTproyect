const express = require("express");
const userController = require("../controllers/userControllers");

const userRouter = express.Router();
/**
 * @openapi
 * /user:
 * get:
 * tags:
 * - user
 * description:Return a single user
 * responses:
 * 200:
 * description: OK
 * content:
 * application/json:
 * schema:
 * type: object
 * properties: 
 * status:
 * type: string
 * example: OK
 * data:
 * type: array
 * items:
 * type: object
 */

userRouter.post("/",userController.addUser);  //Registro
userRouter.post("/login",userController.loginUser);  //Login


userRouter.delete("/:id", userController.deleteUser);  //Delete
userRouter.patch("/:id",userController.updateUser); // Actualizar

module.exports = userRouter;