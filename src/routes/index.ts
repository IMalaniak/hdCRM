import { Controller, ClassOptions, Children, Get } from '@overnightjs/core';
import { UserController } from './controllers';
import { Request, Response } from 'express';
import { OK } from 'http-status-codes';

@Controller('api/')
@ClassOptions({mergeParams: true})
@Children([
    new UserController()
])
export class ApiController {

    @Get('')
    private connectionCheck(req: Request, res: Response) {
        res.status(OK).json({ success: true, message: 'Connected!' });
    }

}
