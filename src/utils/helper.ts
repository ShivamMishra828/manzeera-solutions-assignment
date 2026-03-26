import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ServerConfig from '../config/server-config';
import mongoose from 'mongoose';

export function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export function comparePassword(inputPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(inputPassword, hashedPassword);
}

export function generateToken(userId: mongoose.Types.ObjectId): string {
    return jwt.sign({ userId }, ServerConfig.JWT_SECRET, {
        expiresIn: '1d',
    });
}
