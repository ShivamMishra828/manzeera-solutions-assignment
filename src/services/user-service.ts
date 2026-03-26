import UserRepository from '../repositories/user-repository';
import { CreateUserInput } from '../interfaces';
import { IUser } from '../models/user-model';
import AppError from '../utils/app-error';
import { StatusCodes } from 'http-status-codes';
import { hashPassword } from '../utils/helper';

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
}

export default UserService;
