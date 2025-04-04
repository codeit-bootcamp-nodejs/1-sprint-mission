"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPrismaError = isPrismaError;
exports.isSyntaxErrorWithBody = isSyntaxErrorWithBody;
function isPrismaError(err) {
    return typeof err === 'object' && err !== null && 'code' in err;
}
function isSyntaxErrorWithBody(err) {
    return (typeof err === 'object' &&
        err !== null &&
        err instanceof SyntaxError &&
        'status' in err &&
        typeof err.status === 'number' && //모르겠다다
        'body' in err);
}
