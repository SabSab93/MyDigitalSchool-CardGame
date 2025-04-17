import { Request, Response } from 'express';
import { controller, httpPost, request, response } from 'inversify-express-utils';
import { IProfileService } from '../interfaces/services/profile.service';
import SERVICE_TYPES from '../interfaces/services/services.types';
import { inject } from 'inversify';

@controller('/api/login')
export class LogUserController {
    constructor(
        @inject(SERVICE_TYPES.ProfileService) private readonly profileService: IProfileService,
    ) {}

    @httpPost('/')
    public async login(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const token: string = await this.profileService.login(req.body.login, req.body.password);
            res.status(200).send({ token: `JWT ${token}` });
        } catch (error: any) {
            console.error('Error : ', error);
            res.status(500).send({ message: error.message });
        }
    }
}
