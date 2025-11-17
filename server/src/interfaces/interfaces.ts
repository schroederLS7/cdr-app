import { CDR } from "../classes/CDR";

export const Status = {
    Success: "Success",
    Error: "Error",
}

export interface DisplayMessage {
    status: string,
    message?: string,
    timestamp?: string
}

export interface CDRParseResponse extends DisplayMessage {
    CDR?: CDR
}

export interface CDRFileUploadResponse extends DisplayMessage {
}

export interface CDRPutResponse extends DisplayMessage {
}

export interface CDRGetResponse extends DisplayMessage {
    CDRs?: CDR[],
}