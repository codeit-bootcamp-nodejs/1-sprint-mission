import jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from './constants.js';
export function generateTokens(userId) {
    const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
    });
    const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });
    return { accessToken, refreshToken };
}
export function verifyAccessToken(token) {
    const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
    if (typeof decoded !== 'object' || typeof decoded.id !== 'number') {
        throw new Error('Invalid token');
    }
    return { id: decoded.id };
}
export function verifyRefreshToken(token) {
    const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
    if (typeof decoded !== 'object' || typeof decoded.id !== 'number') {
        throw new Error('Invalid token');
    }
    return { id: decoded.id };
}
