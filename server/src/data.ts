import pgPromise from 'pg-promise';
import { CDR } from './classes/CDR';
import { CDRPutResponse, Status, CDRGetResponse } from './interfaces/interfaces'


export const pgp = pgPromise({});

const db = pgp('postgresql://postgres:postgres@postgres:5432/cdr');

//Use this to debug when Postgres container is running locally
// const db = pgp('postgresql://postgres:postgres@localhost:5432/cdr');

export async function putCDR(cdr: CDR): Promise<CDRPutResponse> {
    try {
        await db.oneOrNone('INSERT INTO calldetailrecords (id, mnc, bytes_used,dmcc,cell_id,ip) VALUES ($1, $2, $3, $4, $5, $6)',
            [cdr.id, cdr.mnc, cdr.bytes_used, cdr.dmcc, cdr.cell_id, cdr.ip]);
    } catch (error) {
        if (error instanceof Error) {
            return { status: Status.Error, message: `CDR id ${cdr.id} was not saved to database - ${error.message}` };
        } else {
            return { status: Status.Error, message: `CDR id ${cdr.id} was not saved to database - ${error}` };
        }

    }
    return { status: Status.Success, message: `CDR id ${cdr.id} successfully saved to database` };
}

export async function getAll(): Promise<CDRGetResponse> {
    let returnResponse: CDRGetResponse = { status: Status.Error, message: `CDRs could not be retrieved - unknown error` }

    try {
        await db.any('SELECT * FROM calldetailrecords',
            []).then(cdrs => {
                returnResponse = { status: Status.Success, message: `All CDRs [${cdrs.length}] retrieved`, CDRs: cdrs };
            });
    } catch (error) {
        if (error instanceof Error) {
            return { status: Status.Error, message: `CDRs could not be retrieved - ${error.message}` };
        } else {
            return { status: Status.Error, message: `CDRs could not be retrieved - ${error}` };
        }
    }

    return returnResponse;
}

export async function runQuery(query: string): Promise<CDRGetResponse> {
    let returnResponse: CDRGetResponse = { status: Status.Error, message: `CDRs could not be retrieved - unknown error` }

    try {
        await db.any(query,
            []).then(cdrs => {
                returnResponse = { status: Status.Success, CDRs: cdrs, message: `Query Successful - ${cdrs.length} CDRs returned.` };
            });
    } catch (error) {
        if (error instanceof Error) {
            return { status: Status.Error, message: `CDRs could not be retrieved - ${error.message}` };
        } else {
            return { status: Status.Error, message: `CDRs could not be retrieved - ${error}` };
        }
    }

    return returnResponse;
}