export class IcNamingError extends Error {}
// More error type eg: `export class IcNamingInternalError extends IcNamingError {}`

export class IcNamingCanisterError extends IcNamingError {
  theIcNamingCanisterErrorResult: unknown;

  constructor(rawResult: unknown) {
    const result = rawResult as {
      Err?: { message?: string };
    };

    super(`IcNamingCanisterError: ${result?.Err?.message || "unknown"}`);
    this.theIcNamingCanisterErrorResult = rawResult;
  }
}
