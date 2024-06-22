import { Request, Response, request } from 'express';
import mssql, { VarChar } from 'mssql';
import { sqlConfig } from '../config/dbConfig';
import { IProduct, IProductDTO } from '../Models/productModels';
import { v4 as uid } from 'uuid';
import { getCategoryNameFromId } from '../Controllers/categoryController';
import { DbHelper } from '../DatabaseHelpers/dbHelper';

const _dbHelper = new DbHelper();
export const addNewProduct = async (_request: IProductDTO, _response: Response) => {
    try {
        const id = uid();
        const { Name } = _request.body;
        const { CategoryId } = _request.body;
        if (!Name || !CategoryId) {
            return _response
                .status(400)
                .json({ message: 'All fields must be filled inorder to add a new product to a Category' });
        }
        const categoryDetails = await getCategoryNameFromId(CategoryId);
        const categoryName = categoryDetails?.Name;
        // const pool = await mssql.connect(sqlConfig);
        // await pool.request().input('Id', Id).input('Name', Name).input('CategoryId', CategoryId).execute('addProduct');
        await _dbHelper.executeProcedure('addProduct', { Id: id, Name, CategoryId });
        return _response.status(201).json({
            message: `product, ${Name} has been created and added to inventory under category ${categoryName}`,
        });
    } catch (error) {
        _response.status(500).json(error);
    }
};

export const getAllProducts = async (_request: Request, _response: Response) => {
    try {
        // const pool = await mssql.connect(sqlConfig);
        // const allProducts = (await pool.request().execute('getAllProducts'))
        const allProducts = (await _dbHelper.executeProcedure('getAllProducts', {})).recordset as IProduct[];
        if (allProducts.length > 0) {
            return _response.status(200).json(allProducts);
        }
        return _response.status(404).json({ message: 'Nothing found, add new product' });
    } catch (error) {
        _response.status(500).json(error);
    }
};

export const getProductById = async (_request: Request<{ id: string }>, _response: Response) => {
    try {
        // const pool = mssql.connect(sqlConfig);
        // const foundProduct = (await (await pool).request().input('Id', _request.params.id).execute('getProductById'))

        const foundProduct = (await (
            await _dbHelper.executeProcedure('getProductById', { Id: _request.params.id })
        ).recordset[0]) as IProduct;
        if (foundProduct) {
            return _response.status(200).json(foundProduct);
        }
        return _response.status(404).json({ message: 'Sorry we havent found any product with that id' });
    } catch (error) {
        _response.status(500).json(error);
    }
};

export const updateProduct = async (_request: Request<{ id: string }>, _response: Response) => {
    try {
        // const pool = mssql.connect(sqlConfig);
        // const productToBeEdited = (
        //     await (await pool).request().input('Id', _request.params.id).execute('getProductById')
        // )
        const productToBeEdited = (await _dbHelper.executeProcedure('getProductById', { Id: _request.params.id }))
            .recordset[0] as IProduct;
        if (!productToBeEdited) {
            return _response
                .status(404)
                .json({ message: 'Sorry we havent found the product you want to update, kindly check the id again' });
        }

        //------------------------------------

        const oldName = productToBeEdited.Name;

        if (productToBeEdited.Id == _request.params.id) {
            const { Name } = _request.body;
            const { CategoryId } = _request.body;
            const newDetails = await _dbHelper.executeProcedure('updateProduct', {
                Id: _request.params.id,
                Name,
                CategoryId,
            });
            // = (await pool)
            //     .request()
            //     .input('Id', _request.params.id)
            //     .input('Name', Name)
            //     .input('CategoryId', CategoryId)
            //     .execute('updateProduct');
            const categoryDetails = await getCategoryNameFromId(CategoryId);
            const categoryName = categoryDetails?.Name;
            return _response
                .status(200)
                .json(
                    `Product: '${oldName}' has been updated to: '${Name}'  and placed under the category: '${categoryName}' `
                );
        }
    } catch (error) {
        _response.status(500).json(error);
    }
};

export const deleteProduct = async (_request: Request<{ id: string }>, _response: Response) => {
    try {
        // const pool = mssql.connect(sqlConfig);
        // const productToBeDeleted = (
        //     await (await pool).request().input('Id', _request.params.id).execute('getProductById')
        // )
        const productToBeDeleted = (await _dbHelper.executeProcedure('getProductById', { Id: _request.params.id }))
            .recordset[0] as IProduct;
        if (!productToBeDeleted) {
            return _response.status(404).json({
                message: 'Sorry the product doesnt exist',
            });
        }
        if (productToBeDeleted.Id == _request.params.id) {
            // (await pool)
            //     .request()
            //     .input('Id', _request.params.id)

            //     .execute('deleteProduct');
            await _dbHelper.executeProcedure('deleteProduct', { Id: _request.params.id });
            return _response.status(200).json(`Product '${productToBeDeleted.Name}' has been deleted`);
        }
    } catch (error) {
        _response.status(500).json(error);
    }
};