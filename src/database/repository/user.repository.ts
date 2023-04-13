import { Request, Response } from "express";
import { Repository } from "typeorm/repository/Repository";
import { User } from "../entity/User";
import { AppDataSource } from "../../data-source";
import { Friend } from "../entity/Friend";


export const UserRepository = AppDataSource.getRepository(User).extend({

    async checkUserExists(email: string): Promise<boolean> {
        const checkIfUserExists = await this.createQueryBuilder("user")
            .select()
            .where("user.email = :email", { email })
            .getCount() > 0;
        return checkIfUserExists;
    },

    async findUserPassword(email: string) {
        const baseUserPassword = await this.createQueryBuilder("user")
            .select("user.password")
            .where("user.email = :email", { email })
            .getOne()
        return baseUserPassword;
    },

    async createUser(username: string, email: string, hashedPassword: any) {
        this.createQueryBuilder("user")
            .insert()
            .values({
                username,
                email,
                password: hashedPassword,
            })
            .execute();
    },

    async searchUser(username: string, userId: string) {
        // const users = await this
        //     .createQueryBuilder('user')
        //     .leftJoinAndSelect('user.sentFriendRequests', 'sentFriendRequests')
        //     .leftJoinAndSelect('user.receivedFriendRequests', 'receivedFriendRequests')
        //     .select(['user.id', 'user.username', 'sentFriendRequests.id', 'receivedFriendRequests.id'])
        //     .addSelect("CASE WHEN (sentFriendRequests.id IS NOT NULL OR receivedFriendRequests.id IS NOT NULL) THEN true ELSE false END", "isFriend")
        //     .where('user.username ILIKE :username', { username: `%${username}%` })
        //     .getMany();
        // console.log(users);
        // const users = await this
        //     .createQueryBuilder('user')
        //     .select('user.*, friend.id IS NOT NULL as isFriend')
        //     .from(User, 'user')
        //     .leftJoin(Friend, 'friend', 'user.id = friend.senderId AND friend.receiverId = :currentUserId', { userId })
        //     .orWhere('user.id != :currentUserId', { userId })
        //     .andWhere('friend.id IS NULL')
        //     .andWhere('LOWER(user.username) LIKE LOWER(:username)', { username: `%${username}%` })
        //     .getRawMany()

        // console.log(users)

        // const users = await this
        //     .createQueryBuilder('user')
        //     .select(['user.id', 'user.username'])
        //     .addSelect('(CASE WHEN friend.id IS NOT NULL THEN true ELSE false END)', 'isFriend')
        //     .leftJoin(Friend, 'friend', 'user.id = friend.receiverId AND friend.senderId = :userId', { userId })
        //     .where('LOWER(user.username) LIKE LOWER(:username)', { username: `%${username}%` })
        //     .andWhere('user.id != :userId', { userId })
        //     .getRawMany();

        const users = await this
            .createQueryBuilder('user')
            .select(['user.id', 'user.username'])
            .addSelect('(CASE WHEN friend.id IS NOT NULL THEN true ELSE false END)', 'isFriend')
            .leftJoin(
                Friend,
                'friend',
                '(friend.senderId = :userId AND friend.receiverId = user.id) OR (friend.senderId = user.id AND friend.receiverId = :userId)',
                { userId }
            )
            .where('LOWER(user.username) LIKE LOWER(:username)', { username: `%${username}%` })
            .andWhere('user.id != :userId', { userId })
            .getRawMany();

        return users;
    }
})