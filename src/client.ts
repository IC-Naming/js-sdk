import { Principal } from "@dfinity/principal";
// import { QuotaType } from "./canisters/registrar/registrar.did";
import { IcNamingClientBase, IcNamingClientInitOptions } from "./internal/base";
import { throwable } from "./internal/utils";

export class IcNamingClient extends IcNamingClientBase {
  constructor(options: IcNamingClientInitOptions) {
    super(options);
  }

  /* Registrar */

  async isAvailableNaming(naming: string) {
    return await throwable(() => this.registrar.available(naming));
  }

  async getExpiredTimeOfName(name: string) {
    return await throwable(() => this.registrar.get_name_expires(name));
  }

  async getRegistrarPrices() {
    const { items } = await throwable(() => this.registrar.get_price_table());
    return items;
  }

  // async submitRegisterOrder(name: string, years: number) {
  //   return await throwable(() => this.registrar.submit_order({ name, years }));
  // }

  // async refundRegisterOrder() {
  //   return await throwable(() => this.registrar.refund_order());
  // }

  // async cancelRegistrarOrder() {
  //   return await throwable(() => this.registrar.cancel_order());
  // }

  // async confirmRegistrarOrder(blockHeight: bigint) {
  //   return await throwable(() => this.registrar.confirm_pay_order(blockHeight));
  // }

  // async getPendingOrder() {
  //   return await throwable(() => this.registrar.get_pending_order());
  // }

  // async registerNameByQuota(
  //   name: string,
  //   quota: Extract<QuotaType, { LenGte: unknown }>["LenGte"]
  // ) {
  //   const wrappedQuota: QuotaType = { LenGte: quota };
  //   return await throwable(() =>
  //     this.registrar.register_with_quota(name, wrappedQuota)
  //   );
  // }

  async getRegistrationOfName(name: string) {
    return await throwable(() => this.registrar.get_details(name));
  }

  async getRegistrantOfName(name: string) {
    return await throwable(() => this.registrar.get_owner(name));
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

  // --- Registry ---

  async getNamesOfController(
    address: Principal,
    params: { offset: bigint; limit: bigint }
  ) {
    const { items } = await throwable(() =>
      this.registry.get_controlled_names(address, params)
    );
    return items;
  }

  async getControllerOfName(name: string) {
    return await throwable(() => this.registry.get_owner(name));
  }

  async getResolverOfName(name: string) {
    return await throwable(() => this.registry.get_resolver(name));
  }

  async getRegistryOfName(name: string) {
    return await throwable(() => this.registry.get_details(name));
  }

  // --- Resolver ---

  async getRecordsOfName(name: string) {
    return await throwable(() => this.resolver.get_record_value(name));
  }

  // --- Favorites ---

  async getFavoriteNames() {
    return await throwable(() => this.favorites.get_favorites());
  }
}
