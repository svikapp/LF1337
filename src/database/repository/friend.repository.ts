import { Brackets, SelectQueryBuilder } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Friend } from "../entity/Friend";
import { User } from "../entity/User";
import { UserRepository } from "./user.repository";

export const FriendRepository = AppDataSource.getRepository(Friend).extend({
    async insertFriendRequest(senderId: string, receiverId: string) {
        await this.createQueryBuilder("friend")
            .insert()
            .values({
                senderId,
                receiverId
            })
            .execute();
        const res = await this.createQueryBuilder("friend")
            .select()
            .where("friend.senderId = :senderId AND friend.receiverId = :receiverId", { senderId, receiverId })
            .getOne()
        return res;
    },

    async acceptFriendRequest(id: string) {
        const friend = await this.findOneBy({ id: id });
        if (!friend) {
            return { message: 'Friend Request Not Found' }
        }
        friend.isAccepted = true;
        await this.save(friend);
        return { message: 'Accepted Request!' }
    },

    async declineFriendRequest(id: string) {
        const friend = await this.findOneBy({ id: id });
        if (!friend) {
            return { message: 'Friend Request Not Found' }
        }
        friend.isDeclined = true;
        await this.save(friend);
        return { message: 'Declined Request!' }
    },

    async getFriendList(userId: string) {
        const friends = await this.createQueryBuilder('friend')
            .select(['user.id', 'user.username'])
            .innerJoin(User, 'user', 'user.id = friend.senderId OR user.id = friend.receiverId')
            .where('(friend.senderId = :userId OR friend.receiverId = :userId) AND friend.isAccepted = true', { userId })
            .andWhere('user.id != :userId')
            // .andWhere('user.deletedAt IS NULL') // Optional: Check for deleted users
            // .andWhere('friend.deletedAt IS NULL') // Optional: Check for deleted friendships
            .setParameter('userId', userId)
            .getRawMany();

        // console.log(friends);
        return friends;
    }


})