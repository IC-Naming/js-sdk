import {
  Actor,
  ActorConfig,
  ActorSubclass,
  HttpAgent,
  HttpAgentOptions,
} from "@dfinity/agent";
import { IDL } from "@dfinity/candid";
import { Principal } from "@dfinity/principal";

import * as FavoritesDid from "../canisters/favorites/favorites.did";
import * as RegistrarDid from "../canisters/registrar/registrar.did";
import * as RegistryDid from "../canisters/registry/registry.did";
import * as ResolverDid from "../canisters/resolver/resolver.did";
import {
  IC_LOCAL_HOST,
  IC_PUBLIC_HOST,
  MAINNET_CANISTER_ID_GROUP,
  TICP_CANISTER_ID_GROUP,
} from "./config";

export interface IcNamingClientInitOptions {
  net: "MAINNET" | "TICP";
  mode: "production" | "local";
  httpAgentOptions?: HttpAgentOptions;
}

export class IcNamingClientBase {
  private _options: IcNamingClientInitOptions;
  private _httpAgent: HttpAgent;

  protected favorites;
  protected registrar;
  protected registry;
  protected resolver;

  constructor(options: IcNamingClientInitOptions) {
    this._options = options;

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
      host: this._options.mode === "local" ? IC_LOCAL_HOST : IC_PUBLIC_HOST,
      ...this._options.httpAgentOptions,
    });
  }

  private _init_actors_before() {
    if (this._options.mode === "local") {
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
