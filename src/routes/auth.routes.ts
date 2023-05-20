import { NextFunction, Response, Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthRequest, tokenMiddleware } from "../middleware/verify_jwt";

const authRouter = Router();


authRouter.post("/signup",AuthController.signup)
authRouter.get("/login",AuthController.login)
authRouter.get("/search",tokenMiddleware,AuthController.search)
authRouter.get("/session",AuthController.verifySession)

export default authRouter