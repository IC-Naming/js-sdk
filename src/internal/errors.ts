export class IcNamingError extends Error {}
// More error type eg: `export class IcNamingInternalError extends IcNamingError {}`

export class IcNamingCanisterError extends IcNamingError {
  theIcNamingCanisterErrorResult: unknown;

  constructor(rawResult: unknown) {
    super(
      `IcNamingCanisterError: ${
        (rawResult as { Err?: { message?: string } })?.Err?.message || "unknown"
      }`
    );
    this.theIcNamingCanisterErrorResult = rawResult;
  }
}
