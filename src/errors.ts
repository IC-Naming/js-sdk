export class IcNamingError extends Error {}
// More error type eg: `export class IcNamingInternalError extends IcNamingError {}`

export class IcNamingCanisterError extends IcNamingError {
  theIcNamingCanisterErrorResult: unknown;

  constructor(rawResult: unknown) {
    super("IcNamingCanisterError"); // TODO: better message info
    this.theIcNamingCanisterErrorResult = rawResult;
  }
}
