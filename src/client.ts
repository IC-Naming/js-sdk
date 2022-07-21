import { Principal } from "@dfinity/principal";
// import { QuotaType } from "./canisters/registrar/registrar.did";
import { IcNamingClientBase } from "./internal/base";
import {
  InMemoryNameRecordsCacheStore,
  NameRecordsCacheStore,
} from "./internal/cache";
import { IcNamingClientInitOptions } from "./internal/option";
import { throwable } from "./internal/utils";

export class IcNamingClient extends IcNamingClientBase {
  private enableTTL: boolean;
  private nameRecordsCacheStore?: NameRecordsCacheStore;

  constructor(options: IcNamingClientInitOptions) {
    super(options);

    this.enableTTL = options.enableTTL ?? false;

    this.nameRecordsCacheStore = this.enableTTL
      ? options.nameRecordsCacheStore ?? new InMemoryNameRecordsCacheStore()
      : undefined;
  }

  private async dispatchNameRecordsCache(
    fn: (store: NameRecordsCacheStore) => Promise<void>
  ) {
    if (this.enableTTL && this.nameRecordsCacheStore) {
      await fn(this.nameRecordsCacheStore);
    }
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

  async getRecordsOfName(name: string): Promise<Array<[string, string]>> {
    let cachedRecords: Array<[string, string]> | undefined;

    await this.dispatchNameRecordsCache(async (store) => {
      const target = await store.getRecordsByName(name);

      if (target) {
        if (Date.now() >= target.expired_at) {
          const { ttl } = await this.getRegistryOfName(name);

          await store.setRecordsByName(name, {
            name,
            expired_at: new Date(Date.now() + Number(ttl) * 1000).getTime(),
          });
        } else {
          if (target.records) {
            cachedRecords = target.records.map((i) => [i.key, i.value]);
          }
        }
      } else {
        const { ttl } = await this.getRegistryOfName(name);
        await store.setRecordsByName(name, {
          name,
          expired_at: new Date(Date.now() + Number(ttl) * 1000).getTime(),
        });
      }
    });

    if (cachedRecords) return cachedRecords;

    const result = await throwable(() => this.resolver.get_record_value(name));

    await this.dispatchNameRecordsCache(async (store) => {
      const target = await store.getRecordsByName(name);

      if (target) {
        await store.setRecordsByName(name, {
          ...target,
          records: result.map(([key, value]) => ({ key, value })),
        });
      }
    });

    return result;
  }
  
  async getReverseResolve(principal: Principal): Promise<string> {
    const [result] = await throwable(() =>
      this.resolver.reverse_resolve_principal(principal)
    );

    return result || "";
  }

  // --- Favorites ---

  async getFavoriteNames() {
    return await throwable(() => this.favorites.get_favorites());
  }
}
