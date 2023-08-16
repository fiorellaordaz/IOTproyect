const express = require("express");
const userController = require("../controllers/userControllers");
const userRouter = express.Router();

/**
 * @swagger
 * /api/routes/userRoute:
 *  post:
 *      tags:
 *      - Users
 *      description: nuevo usuario
 *      responses:
 *          200:
 *              description: usuario creado
 */


userRouter.post("/",userController.addUser);  //Registro

/**
 * @swagger
 * /api/routes/userRoute/login:
 *  post:
 *      tags:
 *      - Users
 *      description: usuario regustrado
 *      responses:
 *          200:
 *              description: usuario logueado
 */

userRouter.post("/login",userController.loginUser);  //Login

/**
 * @swagger
 * /api/routes/userRoute/{id}:
 *  delete:
 *      tags:
 *      - Users
 *      description: eliminar usuario
 *      responses:
 *          200:
 *              description: usuario eliminado
 */

userRouter.delete("/:id", userController.deleteUser);  //Delete

/**
 * @swagger
 * /api/routes/userRoute/{id}:
 *  patch:
 *      tags:
 *      - Users
 *      description:  datos de usuario
 *      responses:
 *          200:
 *              description: usuario actualizado
 */

userRouter.patch("/:id",userController.updateUser); // Actualizar


userRouter.get("/:id", userController.verifyToken)  // verificar Token

module.exports = userRouter;