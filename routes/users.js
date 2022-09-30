import express from "express";
import * as userController from "../controllers/users.js"
import auth from "../middlewares/auth.js"
import flash from "connect-flash";


const router = express.Router()

router.get("/", userController.home)

router.get("/newUser", userController.newUserForm);
router.post("/addUser", userController.newUser)

router.get("/signin", userController.loginForm)
router.post("/login", flash, userController.login);

router.get("/dashboard", auth, userController.dashboard)

router.get('/destroy', userController.destroyed)


export default router