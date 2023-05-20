"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware function to verify the JWT token
function tokenMiddleware(req, res, next) {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    let jwt_secret_key = process.env.ACCESS_SECRET_KEY;
    // console.log(token)
    if (!token) {
        return res.status(401).send({ message: 'No token provided', verified: false });
    }
    else {
        jsonwebtoken_1.default.verify(token, jwt_secret_key, (err, user) => {
            if (err) {
                return res.status(403).send({ message: 'Failed to authenticate token', verified: false });
            }
            // return res.send({ message: "verification completed", verified: true })
            if (user) {
                res.locals.user = user;
                // console.log(user)
                next();
            }
        });
    }
}
exports.tokenMiddleware = tokenMiddleware;
