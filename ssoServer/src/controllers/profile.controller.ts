import { Request, Response } from 'express';
import { controller, httpGet, httpPut, request, response } from 'inversify-express-utils';

import { IProfileService } from '../interfaces/services/profile.service';
import { JwtCheckerMiddleware } from '../implementations/middlewares/jwt-checker.middleware';
import { ProfileModel } from '../models/profile.model';
import SERVICE_TYPES from '../interfaces/services/services.types';
import { inject } from 'inversify';

@controller('/api/profiles')
export class ProfileController {
    constructor(
        @inject(SERVICE_TYPES.ProfileService) private readonly profileService: IProfileService,
    ) {}

    @httpGet('', JwtCheckerMiddleware)
    public async getAll(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const profiles: ProfileModel[] = await this.profileService.findAll();
            res.status(200).send(profiles);
        } catch (error: any) {
            console.error('Error : ', error);
            res.status(500).send({ message: error.message });
        }
    }

    @httpPut('')
    public async create(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const profile: Partial<ProfileModel> = req.body;
            const createdProfile: ProfileModel = await this.profileService.create(profile);
            res.status(201).send(createdProfile);
        } catch (error: any) {
            console.error('Error : ', error);
            res.status(500).send({ message: error.message });
        }
    }

    @httpGet('/:id', JwtCheckerMiddleware)
    public async getById(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const id: string = req.params.id as string;
            const profile: ProfileModel = await this.profileService.findById(id);
            res.status(200).send(profile);
        } catch (error: any) {
            console.error('Error : ', error);
            res.status(500).send({ message: error.message });
        }
    }
}
