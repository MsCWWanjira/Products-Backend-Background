import { Request } from 'express';

export interface ICategoryDTO extends Request {
    body: {
        Name: string;
    };
}

export interface ICategory {
    Id: string;
    Name: string;
}