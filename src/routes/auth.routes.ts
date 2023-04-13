import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const authRouter = Router();


authRouter.post("/signup",AuthController.signup)
authRouter.get("/login",AuthController.login)
authRouter.get("/search",AuthController.search)
authRouter.get("/session",AuthController.verifySession)

export default authRouter