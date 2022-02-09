import fetch from "jest-fetch-mock";
import { call_GetRecordValue, FUNCTION_TEST, VARIABLE_TEST } from "../src";

beforeEach(() => {
  fetch.resetMocks();
});

describe("test", () => {
  it("test", () => {
    expect(VARIABLE_TEST).toBe(1);
    expect(FUNCTION_TEST("hello")).toBe("hello");
  });
  it("test call canisters raw index function", () => {
    expect(call_GetRecordValue()).toBeUndefined();
  });
});
