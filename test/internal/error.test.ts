import { IcNamingCanisterError } from "../../src/internal/errors";

describe("Custom error", () => {
  it("should generate normal canister error message", () => {
    const rawError = { Err: { message: "ops" } };

    const customError = new IcNamingCanisterError(rawError);

    expect(customError.message).toBe("IcNamingCanisterError: ops");
  });

  it("should generate unknown canister error message with Err null", () => {
    const rawError = { Err: null };

    const customError = new IcNamingCanisterError(rawError);

    expect(customError.message).toBe("IcNamingCanisterError: unknown");
  });

  it("should generate unknown canister error message with empty object", () => {
    const rawError = {};

    const customError = new IcNamingCanisterError(rawError);

    expect(customError.message).toBe("IcNamingCanisterError: unknown");
  });

  it("should generate unknown canister error message with empty string", () => {
    const rawError = { Err: "" };

    const customError = new IcNamingCanisterError(rawError);

    expect(customError.message).toBe("IcNamingCanisterError: unknown");
  });

  it("should generate unknown canister error message by empty error", () => {
    const rawError = null;

    const customError = new IcNamingCanisterError(rawError);

    expect(customError.message).toBe("IcNamingCanisterError: unknown");
  });
});
