import { CDRParseResponse, Status } from "./interfaces/interfaces";
import { parseBasic, parseExtended, parseHex } from "./parserInternals";

export function parseCDR(input: string): CDRParseResponse {
    const id = input.split(',')[0] ?? "";

    if (!id) {return {status: Status.Error, message: `CDR data is improperly formatted and doesn't contain a numeric id - ${input}`};}

    if (id[id.length-1] == "4" ) {return parseExtended(input);}
    if (id[id.length-1] == "6" ) {return parseHex(input);}

    return parseBasic(input);
}
