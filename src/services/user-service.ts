import UserRepository from '../repositories/user-repository';
import { CreateUserInput, UserSignInInput, UserSignInOutput } from '../interfaces';
import { IUser } from '../models/user-model';
import AppError from '../utils/app-error';
import { StatusCodes } from 'http-status-codes';
import { comparePassword, generateToken, hashPassword } from '../utils/helper';

class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async signup(userData: CreateUserInput): Promise<IUser> {
        try {
            const existingUser = await this.userRepository.findUserByEmail(userData.email);

            if (existingUser) {
                throw new AppError(
                    'User with this email already exists',
                    StatusCodes.CONFLICT,
                    'USER_ALREADY_EXISTS',
                );
            }

            const passwordHash: string = await hashPassword(userData.password);

            const userToCreate = {
                name: userData.name,
                email: userData.email,
                password: passwordHash,
            };

            return await this.userRepository.createUser(userToCreate);
        } catch (err: unknown) {
            if (err instanceof AppError) {
                throw err;
            } else {
                throw new AppError(
                    'An unexpected server error occurred during signup',
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    'INTERNAL_SERVER_ERROR',
                );
            }
        }
    }

    async signin(userData: UserSignInInput): Promise<UserSignInOutput> {
        try {
            const user = await this.userRepository.findUserByEmailWithPassword(userData.email);

            if (!user) {
                throw new AppError(
                    'User with this email does not exist',
                    StatusCodes.NOT_FOUND,
                    'USER_NOT_FOUND',
                );
            }

            const isPasswordValid: boolean = await comparePassword(
                userData.password,
                user.password,
            );

            if (!isPasswordValid) {
                throw new AppError(
                    'Invalid credentials. Please check your email and password',
                    StatusCodes.UNAUTHORIZED,
                    'INVALID_CREDENTIALS',
                );
            }

            const token: string = generateToken(user._id);

            return { user, token };
        } catch (err: unknown) {
            if (err instanceof AppError) {
                throw err;
            } else {
                throw new AppError(
                    'An unexpected server error occurred during signin',
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    'INTERNAL_SERVER_ERROR',
                );
            }
        }
    }
}

export default UserService;
