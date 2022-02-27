import { IcNamingCanisterError } from "./errors";

export const throwable = async <T>(fn: () => Promise<T>) => {
  const result = await fn();

  function isErrResult(result: T): result is Extract<T, { Err: unknown }> {
    return Boolean((result as unknown as { Err: unknown }).Err);
  }

  if (isErrResult(result)) {
    throw new IcNamingCanisterError(result);
  }

  return (result as unknown as { Ok: unknown }).Ok as unknown as Extract<
    T,
    { Ok: unknown }
  >["Ok"];
};
