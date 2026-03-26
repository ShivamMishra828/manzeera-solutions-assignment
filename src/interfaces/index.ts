import { IUser } from '../models/user-model';

export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
}

export interface UserSignInInput {
    email: string;
    password: string;
}

export interface UserSignInOutput {
    user: IUser;
    token: string;
}
