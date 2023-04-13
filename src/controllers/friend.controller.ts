import { Request, Response } from "express";
import { FriendRepository } from "../database/repository/friend.repository";



export class FriendController {
    static async sendFriendRequest(req:Request,res:Response){
        let {senderId,receiverId} = req.body;
        const result = await FriendRepository.insertFriendRequest(senderId,receiverId);
        res.send(result)
    }

    static async acceptFriendRequest(req:Request,res:Response){
        let id = req.body.id;
        const message = await FriendRepository.acceptFriendRequest(id)
        res.json(message)
    }

    static async declineFriendRequest(req:Request,res:Response){
        let id = req.body.id;
        const message = await FriendRepository.declineFriendRequest(id)
        res.json(message)
    }

    static async getFriends(req:Request,res:Response){
        let id = req.body.userId;
        const friends = await FriendRepository.getFriendList(id);
        res.send(friends);
    }
}