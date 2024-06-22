import { v4 as uid } from 'uuid';

import { Request, RequestHandler, Response } from 'express';
import { ICategory, ICategoryDTO } from '../Models/categoryModels';
import mssql from 'mssql';
import { sqlConfig } from '../config/dbConfig';

export const addCategory = async (_request: ICategoryDTO, _response: Response) => {
    try {
        // declare the properties and their content
        const id = uid();
        const { Name } = _request.body;

        console.log(`Request Body: ${JSON.stringify(_request.body)}`);
        if (!Name) {
            return _response.status(400).json({ error: 'Name is required' });
        }

        // Create a connection
        const pool = await mssql.connect(sqlConfig);
        // Make a request to DB
        await pool.request().input('Id', id).input('Name', mssql.VarChar, Name).execute('addCategory');
        _response.status(201).json({ message: `Category: ' ${Name} ', has been created successfully` });
    } catch (error) {
        _response.status(500).json(error);
    }
};

export const getCategories: RequestHandler = async (_request, _response) => {
    try {
        const pool = await mssql.connect(sqlConfig);
        let categories = (await pool.request().execute('getCategories')).recordset as ICategory[];
        _response.status(200).json(categories);
    } catch (error) {
        _response.status(500).json(error);
    }
};
export const getCategoryById = async (_request: Request<{ id: string }>, _response: Response) => {
    try {
        const pool = await mssql.connect(sqlConfig);
        const foundCategory = (await (
            await pool.request().input('Id', _request.params.id).execute('getCategoryById')
        ).recordset[0]) as ICategory;
        if (foundCategory && foundCategory.Id) {
            return _response.status(200).json(foundCategory);
        }
        return _response
            .status(404)
            .json({ message: 'No category has been found assocaited with the id you provided' });
    } catch (error) {
        _response.status(500).json(error);
    }
};

export const deleteCategory = async (_request: Request<{ id: string }>, _response: Response) => {
    try {
        const pool = await mssql.connect(sqlConfig);
        const foundCategory = (await (
            await pool.request().input('Id', _request.params.id).execute('getCategoryById')
        ).recordset[0]) as ICategory;

        if (foundCategory && foundCategory.Id) {
            await pool.request().input('Id', _request.params.id).execute('deleteCategory');
            return _response.status(200).json({ message: `Category ${foundCategory.Name} has been deleted ` });
        }
        return _response.status(404).json({ message: `No Category with id: ${_request.params.id} exists!!` });
    } catch (error) {
        _response.status(500).json(error);
    }
};

export const getCategoryNameFromId = async (Id: string) => {
    try {
        const pool = await mssql.connect(sqlConfig);
        const foundCategory = (await (
            await pool.request().input('Id', Id).execute('getCategoryById')
        ).recordset[0]) as ICategory;
        if (foundCategory && foundCategory.Id) {
            return foundCategory;
        }
        throw new Error('No category has been found assocaited with the id you provided');
    } catch (error) {
        console.error(error);
    }
};