import { IcNamingClientBase } from "./internal/base";
import { throwable } from "./internal/utils";

export class IcNamingClient extends IcNamingClientBase {
  async isAvailableNaming(naming: string) {
    const { Ok } = await throwable(() => this.registrar.available(naming));
    return Ok;
  }
}
