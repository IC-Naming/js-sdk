import { Actor, ActorConfig, ActorSubclass, HttpAgent } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";
import { IcNamingClientInitOptions } from "./option";
import {
  IC_LOCAL_HOST,
  IC_PUBLIC_HOST,
  MAINNET_CANISTER_ID_GROUP,
  TICP_CANISTER_ID_GROUP,
} from "./config";

import * as FavoritesDid from "../canisters/favorites/favorites.did";
import * as RegistrarDid from "../canisters/registrar/registrar.did";
import * as RegistryDid from "../canisters/registry/registry.did";
import * as ResolverDid from "../canisters/resolver/resolver.did";

export class IcNamingClientBase {
  protected options: IcNamingClientInitOptions;

  protected favorites;
  protected registrar;
  protected registry;
  protected resolver;

  private _httpAgent: HttpAgent;

  constructor(options: IcNamingClientInitOptions) {
    this.options = options;

    this._httpAgent = this._initHttpAgent();

    this._init_actors_before();

    const canisterIdMapping =
      options.net === "MAINNET"
        ? MAINNET_CANISTER_ID_GROUP
        : TICP_CANISTER_ID_GROUP;

    this.favorites = this._createActor<FavoritesDid._SERVICE>(
      toDidModuleType(FavoritesDid).idlFactory,
      canisterIdMapping.favorites
    );
    this.registrar = this._createActor<RegistrarDid._SERVICE>(
      toDidModuleType(RegistrarDid).idlFactory,
      canisterIdMapping.registrar
    );
    this.registry = this._createActor<RegistryDid._SERVICE>(
      toDidModuleType(RegistryDid).idlFactory,
      canisterIdMapping.registry
    );
    this.resolver = this._createActor<ResolverDid._SERVICE>(
      toDidModuleType(ResolverDid).idlFactory,
      canisterIdMapping.resolver
    );
  }

  private _initHttpAgent() {
    return new HttpAgent({
      host: this.options.mode === "local" ? IC_LOCAL_HOST : IC_PUBLIC_HOST,
      ...this.options.httpAgentOptions,
    });
  }

  private _init_actors_before() {
    if (this.options.mode === "local") {
      this._httpAgent.fetchRootKey().catch((err) => {
        console.warn(
          "Unable to fetch root key. Check to ensure that your local replica is running"
        );
        console.error(err);
        // TODO: maybe throw ?
      });
    }
  }

  private _createActor<ServiceType>(
    factory: IDL.InterfaceFactory,
    canisterId: ActorConfig["canisterId"]
  ) {
    return Actor.createActor(factory, {
      agent: this._httpAgent,
      canisterId,
    }) as ActorSubclass<ServiceType>;
  }
}

const toDidModuleType = <T>(module: T) => {
  return module as T & { idlFactory: IDL.InterfaceFactory };
};
