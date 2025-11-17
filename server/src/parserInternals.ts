import { CDRParseResponse, Status } from "./interfaces/interfaces";
import { CDR } from "./classes/CDR";
import { isStringValid } from "./helper";

export function parseExtended(input: string): CDRParseResponse {
    const fields = input.split(',');

    if (fields.length != 5) { return { status: Status.Error, message: `CDR data is improperly formatted for extended parsing - ${input}.` }; }

    const id = Number.parseInt(fields[0]!);
    const dmcc = fields[1];
    const mnc = Number.parseInt(fields[2]!);
    const bytes = Number.parseInt(fields[3]!);
    const cell_id = Number.parseInt(fields[4]!);

    if (Number.isFinite(id) && isStringValid(dmcc) && Number.isFinite(mnc) && Number.isFinite(bytes) && Number.isFinite(cell_id)) {
        return { status: Status.Success, message: `CDR record id ${id} parsed successfully.`, CDR: <CDR>({ id: id, dmcc: dmcc, mnc: mnc, bytes_used: bytes, cell_id: cell_id }) }
    }

    return { status: Status.Error, message: `CDR data is improperly formatted for extended parsing - ${input}.` };
}

export function parseHex(input: string): CDRParseResponse {
    const fields = input.split(',');

    if (fields.length != 2) { return { status: Status.Error, message: `CDR data is improperly formatted for hex parsing - ${input}.` }; }

    const id = Number.parseInt(fields[0]!);
    const hex = fields[1]!;

    if (hex.length != 24) { return { status: Status.Error, message: `CDR data is improperly formatted for hex parsing - ${input}.` }; }

    const mnc = convertHexToNum(hex.substring(0, 4));
    const bytes = convertHexToNum(hex.substring(4, 8));
    const cell_id = convertHexToNum(hex.substring(8, 16));
    const ip = getIPAddress(hex.substring(16));

    if (Number.isFinite(id) && Number.isFinite(mnc) && Number.isFinite(bytes) && Number.isFinite(cell_id) && isStringValid(ip)) {
        return { status: Status.Success, message: `CDR record id ${id} parsed successfully.`, CDR: <CDR>({ id: id, mnc: mnc, bytes_used: bytes, cell_id: cell_id, ip: ip }) }
    }

    return { status: Status.Error, message: `CDR data is improperly formatted for hex parsing - ${input}.` };
}

export function parseBasic(input: string): CDRParseResponse {
    const fields = input.split(',');

    if (fields.length != 2) { return { status: Status.Error, message: `CDR data is improperly formatted for basic parsing - ${input}.` }; }

    const id = Number.parseInt(fields[0]!);
    const bytes = Number.parseInt(fields[1]!);

    if (Number.isFinite(id) && Number.isFinite(bytes)) {
        return { status: Status.Success, message: `CDR record id ${id} parsed successfully.`, CDR: <CDR>({ id: id, bytes_used: bytes }) }
    }
    else {
        return { status: Status.Error, message: `CDR data is improperly formatted for basic parsing - ${input}.` };
    }
}

export function getIPAddress(input: string): string {
    return `${convertHexToNum(input.substring(0, 2))}.${convertHexToNum(input.substring(2, 4))}.${convertHexToNum(input.substring(4, 6))}.${convertHexToNum(input.substring(6))}`
}

export function convertHexToNum(input: string): number {
    return Number(`0x${input}`);
}