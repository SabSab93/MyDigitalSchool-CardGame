import { NextFunction, Request, Response } from 'express';

import { BaseMiddleware } from 'inversify-express-utils';
import fs from 'fs';
import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import path from 'path';

@injectable()
export class JwtCheckerMiddleware extends BaseMiddleware {
    private readonly certificatePublicKey: string;

    constructor() {
        super();

        this.certificatePublicKey = this.getCertificate()
    }

    private getCertificate(): string {
        const rootFolderPath: string = path.resolve(path.join('.', 'assets', 'public'));
        const filePath: string = path.join(rootFolderPath, 'jwtRS256.key.pub');
        return fs.readFileSync(filePath, 'utf-8');
    }

    public handler(req: Request, res: Response, next: NextFunction): void {
        const token: string = this.extractTokenFromHeader(req);

        const tokenInfos: TokenInfo = this.verifyToken(token);
        if (!tokenInfos.isValid) {
            res.status(401).send({ response: 'You should be logged in to access this url' });
            return;
        }

        next();
    }

    private extractTokenFromHeader(req: Request): string {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
            return req.headers.authorization.split(' ')[1];
        }

        return '';
    }

    private verifyToken(jwtToken: string): TokenInfo {
        try {
            const decodedToken: any = jwt.verify(jwtToken, this.certificatePublicKey);
            if (Date.now() >= decodedToken.exp * 1000) {
                console.error('-- JWT Token expired --', { jwtToken });
                return {decodedToken: null, isValid: false };
            }

            if (decodedToken.type !== 'Classic') {
                console.error('-- JWT Token bad token type --', { jwtToken });
                return {decodedToken: null, isValid: false };
            }
            return {decodedToken, isValid: true };
        } catch (err) {
            console.error('-- JWT Token invalid --', {});
            return {decodedToken: null, isValid: false };
        }
    }
}

interface TokenInfo {
    decodedToken: any;
    isValid: boolean;
}