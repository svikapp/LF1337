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
exports.FriendController = void 0;
const friend_repository_1 = require("../database/repository/friend.repository");
class FriendController {
    static sendFriendRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { senderId, receiverId } = req.body;
            const result = yield friend_repository_1.FriendRepository.insertFriendRequest(senderId, receiverId);
            res.send(result);
        });
    }
    static acceptFriendRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.body.id;
            const message = yield friend_repository_1.FriendRepository.acceptFriendRequest(id);
            res.json(message);
        });
    }
    static declineFriendRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.body.id;
            const message = yield friend_repository_1.FriendRepository.declineFriendRequest(id);
            res.json(message);
        });
    }
    static getFriends(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.body.userId;
            const friends = yield friend_repository_1.FriendRepository.getFriendList(id);
            res.send(friends);
        });
    }
}
exports.FriendController = FriendController;
