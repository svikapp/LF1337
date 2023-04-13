"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Friend = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let Friend = class Friend {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid")
], Friend.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("uuid")
], Friend.prototype, "senderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User)
], Friend.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.Column)("uuid")
], Friend.prototype, "receiverId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User)
], Friend.prototype, "receiver", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false })
], Friend.prototype, "isAccepted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false })
], Friend.prototype, "isDeclined", void 0);
Friend = __decorate([
    (0, typeorm_1.Entity)()
], Friend);
exports.Friend = Friend;
