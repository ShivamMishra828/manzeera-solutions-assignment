import User, { IUser } from '../models/user-model';
import { CreateUserInput } from '../interfaces';

class UserRepository {
    findUserByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email });
    }

    async findUserByEmailWithPassword(email: string): Promise<IUser | null> {
        return User.findOne({ email }).select('+password');
    }

    createUser(userData: CreateUserInput): Promise<IUser> {
        return User.create(userData);
    }
}

export default UserRepository;
