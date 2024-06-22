import jwt from 'jsonwebtoken';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { NextFunction, Request, Response } from 'express';
import { IPayload } from '../Models/authModels';

export interface IMiddlewareRequest extends Request {
    payloadInformation?: IPayload;
}
export function verifyToken(_request: IMiddlewareRequest, _response: Response, _next: NextFunction) {
    try {
        const token = _request.headers['token'] as string;
        if (!token) {
            return _response.status(401).json({ message: 'Forbiden!!!!!' });
        }

        const decodedTokenData = jwt.verify(token, process.env.SECRET as string) as IPayload;
        _request.payloadInformation = decodedTokenData;
    } catch (error) {
        return _response.status(500).json(error);
    }

    _next();
}