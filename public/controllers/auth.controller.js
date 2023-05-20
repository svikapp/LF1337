"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.AuthController = void 0;
const user_repository_1 = require("../database/repository/user.repository");
const EmailValidator = __importStar(require("email-validator"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class AuthController {
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { email, password } = req.body;
            let jwt_secret_key = process.env.ACCESS_SECRET_KEY;
            const user = yield user_repository_1.UserRepository.findUserPassword(email);
            // console.log(user)
            const basePassword = user === null || user === void 0 ? void 0 : user.password;
            const userId = user === null || user === void 0 ? void 0 : user.id;
            //check if user exists
            if (basePassword === undefined) {
                return res.status(407).send({
                    code: 407,
                    message: "User not found",
                    authenticated: false
                });
            }
            //comparing both passwords
            bcrypt_1.default.compare(password, basePassword, (error, result) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    return res.status(401).send({
                        code: 401,
                        message: "Something went wrong!",
                        authenticated: false
                    });
                }
                if (!result) {
                    return res.status(401).send({
                        code: 401,
                        message: "Wrong Password",
                        authenticated: false
                    });
                }
                // sign the JWT
                jsonwebtoken_1.default.sign({
                    email,
                    userId,
                }, jwt_secret_key, {
                    expiresIn: "1h",
                }, (error, data) => __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        return res.send({
                            code: 401,
                            message: error,
                            authentication: false
                        });
                    }
                    return res.status(201).send({
                        code: 201,
                        message: data,
                        authentication: true
                    });
                }));
            }));
        });
    }
    static signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { username, email, password } = req.body;
            let jwt_secret_key = process.env.ACCESS_SECRET_KEY;
            // validate email
            let isEmailValidated = EmailValidator.validate(email);
            if (!isEmailValidated) {
                return res.send({
                    code: 407,
                    message: "Provide valid email",
                    authentication: false
                });
            }
            //check if user exists
            const userAlreadyExists = yield user_repository_1.UserRepository.checkUserExists(email);
            if (userAlreadyExists) {
                return res.status(401).send({
                    code: 401,
                    authentication: false,
                    message: "User Already exists"
                });
            }
            //hashing the password
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            const userId = yield user_repository_1.UserRepository.createUser(username, email, hashedPassword);
            // sign JWT
            jsonwebtoken_1.default.sign({
                email,
                userId
            }, jwt_secret_key, {
                expiresIn: "1h",
            }, (error, data) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    return res.send({
                        code: 401,
                        message: error,
                        authentication: false
                    });
                }
                return res.status(201).send({
                    code: 201,
                    message: data,
                    authentication: true
                });
            }));
        });
    }
    static search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let username = req.query['username'];
            // let username = res.locals.user;
            if (username != null) {
                let { userId } = res.locals.user;
                const result = yield user_repository_1.UserRepository.searchUser(username, userId);
                res.send(result);
            }
            else {
                res.json({ message: 'pass a username parameter', code: 401 });
            }
        });
    }
    static verifySession(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            let jwt_secret_key = process.env.ACCESS_SECRET_KEY;
            if (!token) {
                return res.status(401).send({ message: 'No token provided', verified: false });
            }
            else {
                jsonwebtoken_1.default.verify(token, jwt_secret_key, (err, decoded) => {
                    if (err) {
                        return res.status(500).send({ message: 'Failed to authenticate token', verified: false });
                    }
                    return res.send({ message: "verification completed", verified: true });
                });
            }
        });
    }
}
exports.AuthController = AuthController;
