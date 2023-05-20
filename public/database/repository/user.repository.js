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
                .select()
                .where("user.email = :email", { email })
                .getOne();
            return baseUserPassword;
        });
    },
    createUser(username, email, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.createQueryBuilder("user")
                .insert()
                .values({
                username,
                email,
                password: hashedPassword,
            })
                .execute();
            return result.raw[0].id;
        });
    },
    searchUser(username, userId) {
        return __awaiter(this, void 0, void 0, function* () {
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
