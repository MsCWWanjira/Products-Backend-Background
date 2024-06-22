import { Request, Response, request } from 'express';

import { v4 as uid } from 'uuid';
import { DbHelper } from '../DatabaseHelpers/dbHelper';
import Joi from 'joi';
import { registerUserSchema } from '../ValidationHelpers/validation';
import Bcrypt from 'bcrypt';
import { IPayload, IUser } from '../Models/authModels';
import jwt from 'jsonwebtoken';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const _dbHelper = new DbHelper();
const secret = process.env.SECRET;

export const registerUser = async (_request: Request, _response: Response) => {
    try {
        const id = uid();
        const { UserName, Email, Password } = _request.body;
        const { error } = registerUserSchema.validate(_request.body);

        if (error) {
            return _response.status(400).json(error.details[0].message);
        }
        const hashedPassword = await Bcrypt.hash(Password, 10);
        await _dbHelper.executeProcedure('addNewUser', { UserId: id, UserName, Email, Password: hashedPassword });
        // let pool = await mssql.connect(sqlConfig);
        // await pool
        //     .request()
        //     .input('UserId', id)
        //     .input('UserName', UserName)
        //     .input('Email', Email)
        //     .input('Password', hashedPassword)
        //     .execute('addNewUser');
        return _response.status(201).json({ message: `User '${UserName}'s account has been created successfully` });
    } catch (error) {
        return _response.status(500).json(error);
    }
};

export const loginUser = async (_request: Request, _response: Response) => {
    try {
        const { Email, Password } = _request.body;
        const user = (await _dbHelper.executeProcedure('getUser', { Email })).recordset as IUser[];

        console.log(`SECRET_KEY ${process.env.SECRET}`);
        console.log(`SECRET ${secret}`);
        if (user.length !== 0) {
            const isPasswordMatch = await Bcrypt.compare(Password, user[0].Password);
            console.log(`DO PWD MATCH ${isPasswordMatch}`);
            if (isPasswordMatch) {
                const payload: IPayload = {
                    Sub: user[0].UserId,
                    UserName: user[0].UserName,
                };
              
                const newToken = jwt.sign(payload, process.env.SECRET as string, { expiresIn: '2h' });

                return _response.status(200).json({ message: 'Login Success', newToken });
            } else {
                return _response.status(400).json({ message: 'Invalid Credentials' });
            }
        }
        return _response.status(400).json({ message: 'Invalid Credentials' });
    } catch (error) {
        return _response.status(500).json(error);
    }
};