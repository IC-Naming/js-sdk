import { IcNamingClientBase } from "./base";
import { IcNamingCanisterError } from "./errors";

export * from "./errors";

export class IcNamingClient extends IcNamingClientBase {
  async isAvailableNaming(naming: string) {
    const result = await throwable(() =>
      this.registrar.available(naming)
    );
  }
}

const throwable = async <T>(fn: () => Promise<T>) => {
  const result = await fn();
  if ((result as { Err?: unknown })?.Err) {
    throw new IcNamingCanisterError(result);
  }
  return result;
};
