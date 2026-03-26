import UserRepository from '../repositories/user-repository';
import UserService from '../services/user-service';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/responses';
import ServerConfig from '../config/server-config';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export async function signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { name, email, password } = req.body;

        const user = await userService.signup({ name, email, password });

        res.status(StatusCodes.CREATED).json(
            new SuccessResponse('User successfully created', user),
        );
    } catch (err: unknown) {
        next(err);
    }
}

export async function signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { email, password } = req.body;

        const { user, token } = await userService.signin({ email, password });

        res.cookie('token', token, {
            httpOnly: true,
            secure: ServerConfig.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
        })
            .status(StatusCodes.OK)
            .json(new SuccessResponse('User successfully logged in', { user, token }));
    } catch (err: unknown) {
        next(err);
    }
}
