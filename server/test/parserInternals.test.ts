import { test, expect, describe, assert } from "vitest";
import { parseBasic, parseExtended, parseHex, getIPAddress, convertHexToNum } from "../src/parserInternals";
import { Status } from "../src/interfaces/interfaces";


describe('Convert hex to number', () => {
    const testCases = [
        { input: "63", output: 99 },
        { input: "7f", output: 127 },
        { input: "c0", output: 192 },
        { input: "00", output: 0 },
        { input: "0e89", output: 3721 },
        { input: "3279", output: 12921 },
        { input: "227712ca", output: 578228938 },
        { input: "be83", output: 48771 },
        { input: "000000c0", output: 192 },
    ];

    test.each(testCases)("convertHexToNum - %s", ({ input, output }) => {
        expect(convertHexToNum(input)).toBe(output);
    });
});

describe('Get ip address from hex value', () => {
    const testCases = [
        { input: "63e5e63d", output: "99.229.230.61" },
        { input: "7f000001", output: "127.0.0.1" },
        { input: "c0a80164", output: "192.168.1.100" },
        { input: "c0014aff", output: "192.1.74.255" }
    ];

    test.each(testCases)("getIPAddress - %s", ({ input, output }) => {
        expect(getIPAddress(input)).toBe(output);
    });
});

describe('parseBasic successes', () => {
    const testCases = [
        { input: "9991,2935", id: 9991, outputBytes: 2935 },
        { input: "7291,293451", id: 7291, outputBytes: 293451 },
    ];

    test.each(testCases)("parseBasic - %s", ({ input, id, outputBytes }) => {
        const response = parseBasic(input);
        expect(response.status).toBe(Status.Success);
        assert.exists(response.CDR)
        expect(response.CDR.id).toBe(id);
        expect(response.CDR.bytes_used).toBe(outputBytes);
    });
});

describe('parseBasic failures', () => {
    const testCases = [
        { input: "9991," },
        { input: ",293451" },
    ];

    test.each(testCases)("parseBasic - %s", ({ input }) => {
        const response = parseBasic(input);
        expect(response.status).toBe(Status.Error);
    });
});

describe('parseExtended successes', () => {
    const testCases = [
        { input: "4,0d39f,0,495594,214", id: 4, dmcc: "0d39f", mnc: 0, outputBytes: 495594, cell_id: 214 },
        { input: "7194,b33,394,495593,192", id: 7194, dmcc: "b33", mnc: 394, outputBytes: 495593, cell_id: 192 },
    ];

    test.each(testCases)("parseExtended - %s", ({ input, id, dmcc, mnc, outputBytes, cell_id }) => {
        const response = parseExtended(input);
        expect(response.status).toBe(Status.Success);
        assert.exists(response.CDR)
        expect(response.CDR.id).toBe(id);
        expect(response.CDR.dmcc).toBe(dmcc);
        expect(response.CDR.mnc).toBe(mnc);
        expect(response.CDR.bytes_used).toBe(outputBytes);
        expect(response.CDR.cell_id).toBe(cell_id);
    });
});

describe('parseExtended failures', () => {
    const testCases = [
        { input: "4,0d39f,,214" },
        { input: "4,0d39f,0,495594" },
        { input: "4,0d39f,,495594,214" },
        { input: "4,0d39f,0,214" },
    ];

    test.each(testCases)("parseExtended - %s", ({ input }) => {
        const response = parseExtended(input);
        expect(response.status).toBe(Status.Error);
    });
});

describe('parseHex successes', () => {
    const testCases = [
        { input: "16,be833279000000c063e5e63d", id: 16, mnc: 48771, outputBytes: 12921, cell_id: 192, ip: "99.229.230.61" },
        { input: "316,0e893279227712cac0014aff", id: 316, mnc: 3721, outputBytes: 12921, cell_id: 578228938, ip: "192.1.74.255" },
    ];

    test.each(testCases)("parseHex - %s", ({ input, id, mnc, outputBytes, cell_id, ip }) => {
        const response = parseHex(input);
        expect(response.status).toBe(Status.Success);
        assert.exists(response.CDR)
        expect(response.CDR.id).toBe(id);
        expect(response.CDR.ip).toBe(ip);
        expect(response.CDR.mnc).toBe(mnc);
        expect(response.CDR.bytes_used).toBe(outputBytes);
        expect(response.CDR.cell_id).toBe(cell_id);
    });
});

describe('parseHex failures', () => {
    const testCases = [
        { input: ",be833279000000c063e5e63d" },
        { input: "16,be833279000000c063" },
    ];

    test.each(testCases)("parseHex - %s", ({ input }) => {
        const response = parseHex(input);
        expect(response.status).toBe(Status.Error);
    });
});