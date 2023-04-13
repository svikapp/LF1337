"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Friend_1 = require("./Friend");
let User = class User {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid")
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("text")
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)("text")
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)("text")
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Friend_1.Friend, friend => friend.sender)
], User.prototype, "sentFriendRequests", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Friend_1.Friend, friend => friend.receiver)
], User.prototype, "receivedFriendRequests", void 0);
User = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
