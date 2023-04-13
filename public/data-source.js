"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Friend_1 = require("./database/entity/Friend");
const User_1 = require("./database/entity/User");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "1480",
    database: "socket_test",
    synchronize: true,
    logging: true,
    entities: [User_1.User, Friend_1.Friend],
    subscribers: [],
    migrations: [],
});
