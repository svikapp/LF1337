import { Request, Response } from "express";
import { UserRepository } from "../database/repository/user.repository";
import * as EmailValidator from "email-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();


export class AuthController {
    static async login(req: Request, res: Response) {
        let { email, password } = req.body;
        let jwt_secret_key = process.env.ACCESS_SECRET_KEY as string;
        const user = await UserRepository.findUserPassword(email);
        const basePassword = user?.password;
        //check if user exists
        if (basePassword === undefined) {
            return res.status(407).send({
                code: 407,
                message: "User not found",
                authenticated: false
            })
        }
        //comparing both passwords
        bcrypt.compare(
            password,
            basePassword,
            async (error: any, result: any) => {
                if (error) {
                    return res.status(401).send({
                        code: 401,
                        message: "Something went wrong!",
                        authenticated: false
                    })
                }
                if (!result) {
                    return res.status(401).send({
                        code: 401,
                        message: "Wrong Password",
                        authenticated: false
                    })
                }

                // sign the JWT
                jwt.sign(
                    {
                        email
                    },
                    jwt_secret_key,
                    {
                        expiresIn: "1h",
                    },
                    async (error: any, data: any) => {
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

                    }
                )
            }
        )
    }
    static async signup(req: Request, res: Response) {
        let { username, email, password } = req.body;
        let jwt_secret_key = process.env.ACCESS_SECRET_KEY as string;

        // validate email
        let isEmailValidated = EmailValidator.validate(email);
        if (!isEmailValidated) {
            return res.send({
                code: 407,
                message: "Provide valid email",
                authentication: false
            })
        }
        //check if user exists
        const userAlreadyExists = await UserRepository.checkUserExists(email);
        if (userAlreadyExists) {
            return res.status(401).send({
                code: 401,
                authentication: false,
                message: "User Already exists"
            })
        }
        //hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await UserRepository.createUser(username, email, hashedPassword);
        // sign JWT
        jwt.sign(
            {
                email
            },
            jwt_secret_key,
            {
                expiresIn: "1h",
            },
            async (error: any, data: any) => {
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

            }
        )
    }

    static async search(req: Request, res: Response) {
        let username = req.query['username'] as string;
        if (username != null) {
            const result = await UserRepository.searchUser(username, req.body['userId'])
            res.send(result)
        }
        else {
            res.json({ message: 'pass a username parameter', code: 401 })
        }
    }

    static async verifySession(req: Request, res: Response) {
        const token = req.headers.authorization?.split(' ')[1];
        let jwt_secret_key = process.env.ACCESS_SECRET_KEY as string;

        if (!token) {
            return res.status(401).send({ message: 'No token provided', verified: false });
        }
        else {
            jwt.verify(token, jwt_secret_key, (err, decoded) => {
                if (err) {
                    return res.status(500).send({ message: 'Failed to authenticate token', verified: false });
                }
                return res.send({ message: "verification completed", verified: true })
            })
        }


    }
}