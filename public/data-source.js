"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Friend_1 = require("./database/entity/Friend");
const User_1 = require("./database/entity/User");
const isProd = process.argv.includes("--prod");
console.log(isProd);
exports.AppDataSource = new typeorm_1.DataSource(Object.assign({ type: "postgres", host: isProd ? process.env.PGHOST : "localhost", port: 5432, username: isProd ? process.env.PGUSER : "postgres", password: isProd ? process.env.PGPASSWORD : "1480", database: isProd ? "main" : "socket_test", extra: { sslmode: 'require' }, synchronize: true, logging: true, entities: [User_1.User, Friend_1.Friend], subscribers: [], migrations: [] }, (!isProd
    ? {}
    : {
        ssl: {
            rejectUnauthorized: false,
        },
    })));
