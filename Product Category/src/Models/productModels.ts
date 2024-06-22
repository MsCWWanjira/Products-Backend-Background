import { Request } from 'express';

export interface IProductDTO extends Request {
    body: {
        Name: string;
        CategoryId: string;
    };
}
export interface IProduct {
    Id: string;
    Name: string;
    CategoryId: string;
}