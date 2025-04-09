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
const authenticate = (options = { optional: false }) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const accessToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[ACCESS_TOKEN_COOKIE_NAME];
        if (!accessToken) {
            if (options.optional)
                return next();
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        try {
            const { id: userId } = verifyAccessToken(accessToken);
            const user = yield prismaClient.user.findUnique({ where: { id: userId } });
            req.user = user;
        }
        catch (_b) {
            if (options.optional)
                return next();
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        return next();
    });
};
export default authenticate;
