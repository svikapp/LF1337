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
exports.FriendRepository = void 0;
const data_source_1 = require("../../data-source");
const Friend_1 = require("../entity/Friend");
const User_1 = require("../entity/User");
exports.FriendRepository = data_source_1.AppDataSource.getRepository(Friend_1.Friend).extend({
    insertFriendRequest(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createQueryBuilder("friend")
                .insert()
                .values({
                senderId,
                receiverId
            })
                .execute();
            const res = yield this.createQueryBuilder("friend")
                .select()
                .where("friend.senderId = :senderId AND friend.receiverId = :receiverId", { senderId, receiverId })
                .getOne();
            return res;
        });
    },
    acceptFriendRequest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const friend = yield this.findOneBy({ id: id });
            if (!friend) {
                return { message: 'Friend Request Not Found' };
            }
            friend.isAccepted = true;
            yield this.save(friend);
            return { message: 'Accepted Request!' };
        });
    },
    declineFriendRequest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const friend = yield this.findOneBy({ id: id });
            if (!friend) {
                return { message: 'Friend Request Not Found' };
            }
            friend.isDeclined = true;
            yield this.save(friend);
            return { message: 'Declined Request!' };
        });
    },
    getFriendList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const friends = yield this.createQueryBuilder('friend')
                .select(['user.id', 'user.username'])
                .innerJoin(User_1.User, 'user', 'user.id = friend.senderId OR user.id = friend.receiverId')
                .where('(friend.senderId = :userId OR friend.receiverId = :userId) AND friend.isAccepted = true', { userId })
                .andWhere('user.id != :userId')
                // .andWhere('user.deletedAt IS NULL') // Optional: Check for deleted users
                // .andWhere('friend.deletedAt IS NULL') // Optional: Check for deleted friendships
                .setParameter('userId', userId)
                .getRawMany();
            // console.log(friends);
            return friends;
        });
    }
});
