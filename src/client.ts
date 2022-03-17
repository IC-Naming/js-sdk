import { Principal } from "@dfinity/principal";
import { IcNamingClientBase } from "./internal/base";
import { throwable } from "./internal/utils";

export class IcNamingClient extends IcNamingClientBase {
  constructor(options: IcNamingClientInitOptions) {
    super(options);
  }

  async isAvailableNaming(naming: string) {
    return await throwable(() => this.registrar.available(naming));
  }

  async getExpiredTimeOfName(name: string) {
    return await throwable(() => this.registrar.get_name_expires(name));
  }

  async getNamesOfRegistrant(
    address: Principal,
    params: { offset: bigint; limit: bigint }
  ) {
    const { items } = await throwable(() =>
      this.registrar.get_names(address, params)
    );
    return items;
  }

  async getNamesOfController(
    address: Principal,
    params: { offset: bigint; limit: bigint }
  ) {
    const { items } = await throwable(() =>
      this.registry.get_controlled_names(address, params)
    );
    return items;
  }

  async getRegistrantOfName(name: string) {
    return await throwable(() => this.registrar.get_owner(name));
  }

  async getControllerOfName(name: string) {
    return await throwable(() => this.registry.get_owner(name));
  }

  async getResolverOfName(name: string) {
    return await throwable(() => this.registry.get_resolver(name));
  }

  async getRegistrationOfName(name: string) {
    return await throwable(() => this.registrar.get_details(name));
  }

  async getRecordsOfName(name: string) {
    return await throwable(() => this.resolver.get_record_value(name));
  }

  async getRegistryOfName(name: string) {
    return await throwable(() => this.registry.get_details(name));
  }
}
