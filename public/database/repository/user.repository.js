"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_1 = require("../entity/User");
const data_source_1 = require("../../data-source");
const Friend_1 = require("../entity/Friend");
exports.UserRepository = data_source_1.AppDataSource.getRepository(User_1.User).extend({
    checkUserExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkIfUserExists = (yield this.createQueryBuilder("user")
                .select()
                .where("user.email = :email", { email })
                .getCount()) > 0;
            return checkIfUserExists;
        });
    },
    findUserPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseUserPassword = yield this.createQueryBuilder("user")
                .select("user.password")
                .where("user.email = :email", { email })
                .getOne();
            return baseUserPassword;
        });
    },
    createUser(username, email, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            this.createQueryBuilder("user")
                .insert()
                .values({
                username,
                email,
                password: hashedPassword,
            })
                .execute();
        });
    },
    searchUser(username, userId) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const users = yield this
                .createQueryBuilder('user')
                .select(['user.id', 'user.username'])
                .addSelect('(CASE WHEN friend.id IS NOT NULL THEN true ELSE false END)', 'isFriend')
                .leftJoin(Friend_1.Friend, 'friend', '(friend.senderId = :userId AND friend.receiverId = user.id) OR (friend.senderId = user.id AND friend.receiverId = :userId)', { userId })
                .where('LOWER(user.username) LIKE LOWER(:username)', { username: `%${username}%` })
                .andWhere('user.id != :userId', { userId })
                .getRawMany();
            return users;
        });
    }
});
