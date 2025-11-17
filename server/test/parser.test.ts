import { test, expect, vi, assert, describe } from "vitest";
import { parseCDR } from "../src/parser";
import { Status } from "../src/interfaces/interfaces";

import * as internals from "../src/parserInternals";

describe("badParse", () => {
   test.each(["",
      "1",
      "9991,",
      ",293451",
      "4,0d39f,,214",
      "4,0d39f,0,495594",
      "4,0d39f,,495594,214",
      "4,0d39f,0,214",
      ",be833279000000c063e5e63d",
      "16,be833279000000c063"])
      ("Bad Parse - %s", (input) => {
         const cdrResponse = parseCDR(input)
         expect(cdrResponse.status).toBe(Status.Error);
      });
});

test("Basic Parse", () => {
   const spy = vi.spyOn(internals, "parseBasic");
   const cdrResponse = parseCDR("9991,2935")
   expect(cdrResponse).toHaveProperty("message", "CDR record id 9991 parsed successfully.");
   expect(cdrResponse).toHaveProperty("status", Status.Success);

   const CDR = cdrResponse.CDR;
   assert.exists(CDR);

   expect(spy).toHaveBeenCalled();
});

test("Extended Parse", () => {
   const spy = vi.spyOn(internals, "parseExtended");
   const cdrResponse = parseCDR("4,0d39f,0,495594,214")
   expect(cdrResponse).toHaveProperty("message", "CDR record id 4 parsed successfully.");
   expect(cdrResponse).toHaveProperty("status", Status.Success);

   const CDR = cdrResponse.CDR;
   assert.exists(CDR);

   expect(spy).toHaveBeenCalled();
});

test("Hex Parse", () => {
   const spy = vi.spyOn(internals, "parseHex");

   const cdrResponse = parseCDR("16,be833279000000c063e5e63d");

   expect(cdrResponse).toHaveProperty("message", "CDR record id 16 parsed successfully.");
   expect(cdrResponse).toHaveProperty("status", Status.Success);

   expect(spy).toHaveBeenCalled();
});

