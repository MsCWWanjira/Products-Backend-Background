import mssql, { ConnectionPool, Request } from 'mssql';
import { sqlConfig } from '../config/dbConfig';

export class DbHelper {
    //MAKE A REQUEST
    //CAPTURE INPUTS IF ANY
    //EXECUTE A PROCEDURE
    //GET RESULT IF ANY
    private pool: Promise<ConnectionPool>;

    constructor() {
        //CONNECT
        this.pool = mssql.connect(sqlConfig);
    }

    async createRequest(newRequest: Request, data: { [key: string]: string | number }) {
        const keys = Object.keys(data);
        keys.map((key) => {
            newRequest.input(key, data[key]);
        });
        return newRequest;
    }

    async executeProcedure(storedProcedure: string, data: { [key: string]: string | number }) {
        const emptyRequest = (await this.pool).request();
        const request = this.createRequest(emptyRequest, data);
        let results = (await request).execute(storedProcedure);
        return results;
    }

    async executeQuery(queryString: string) {
        let results = await (await this.pool).request().query(queryString);
        return results;
    }
}