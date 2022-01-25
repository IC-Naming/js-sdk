import { FUNCTION_TEST, VARIABLE_TEST } from "../src";

describe("test", () => {
  it("test", () => {
    expect(VARIABLE_TEST).toBe(1);
    expect(FUNCTION_TEST("hello")).toBe("hello");
  });
});
