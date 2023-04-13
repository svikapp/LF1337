import { Router } from "express";
import { FriendController } from "../controllers/friend.controller";

const friendRouter = Router();


friendRouter.post("/create", FriendController.sendFriendRequest);
friendRouter.put("/accept", FriendController.acceptFriendRequest);
friendRouter.put("/decline", FriendController.declineFriendRequest);
friendRouter.get("/list", FriendController.getFriends);

export default friendRouter;