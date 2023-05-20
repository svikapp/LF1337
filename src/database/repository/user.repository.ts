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
            .select()
            .where("user.email = :email", { email })
            .getOne()
        return baseUserPassword;
    },

    async createUser(username: string, email: string, hashedPassword: any) {
        let result = await this.createQueryBuilder("user")
            .insert()
            .values({
                username,
                email,
                password: hashedPassword,
            })
            .execute();
        return result.raw[0].id;

    },

    async searchUser(username: string, userId: string) {
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