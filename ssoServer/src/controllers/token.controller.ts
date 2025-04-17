import { Request, Response } from 'express';
import {
    controller,
    httpGet,
    request,
    response,
} from 'inversify-express-utils';

import { ITokenService } from '../interfaces/services/token.service';
import { JwtCheckerMiddleware } from '../implementations/middlewares/jwt-checker.middleware';
import SERVICE_TYPES from '../interfaces/services/services.types';
import { TOKEN_TYPE } from '../models/token-info.model';
import { inject } from 'inversify';

@controller('/api/token', JwtCheckerMiddleware)
export class TokenController {
    constructor(
    @inject(SERVICE_TYPES.TokenService)
    private readonly tokenService: ITokenService,) 
    {}

    @httpGet('/refresh/:id')
    public async refreshToken(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const id: string = req.params.id as string;
            const token: string = await this.tokenService.generateToken(
                { id, type: TOKEN_TYPE.CLASSIC },
                '15m'
            );
            res.status(200).send({ token: `JWT ${token}` });

        } catch (error: any) {
            console.error('Error : ', error);
            res.status(500).send({ message: error.message });
        }
    }
}
