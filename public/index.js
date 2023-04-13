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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const data_source_1 = require("./data-source");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const friend_routes_1 = __importDefault(require("./routes/friend.routes"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
// initalize type orm
data_source_1.AppDataSource.initialize().then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Db Connected');
    const app = (0, express_1.default)();
    app.use(body_parser_1.default.json());
    const httpServer = (0, http_1.createServer)(app);
    const io = new socket_io_1.Server(httpServer);
    // app.listen(3000)
    // console.log('Server started at http://localhost:3000')
    httpServer.listen(3000, () => {
        console.log('Server started at http://localhost:3000');
    });
    // Routes
    app.use("/user", auth_routes_1.default);
    app.use("/friend", friend_routes_1.default);
})).catch((err) => {
    console.log(err);
});
