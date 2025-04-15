var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { prismaClient } from '../lib/prismaClient.js';
import { verifyAccessToken } from '../lib/token.js';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants.js';
function authenticate(options = { optional: false }) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
        if (!accessToken) {
            if (options.optional) {
                next();
            }
            res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const { userId } = verifyAccessToken(accessToken);
            const user = yield prismaClient.user.findUnique({ where: { id: userId } });
            req.user = user;
        }
        catch (error) {
            if (options.optional) {
                next();
            }
            res.status(401).json({ message: 'Unauthorized' });
        }
        next();
    });
}
export default authenticate;
