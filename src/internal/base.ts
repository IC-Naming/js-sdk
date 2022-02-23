import {
  Actor,
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

export interface IcNamingClientInitOptions {
  canisterId: string | Principal;
  fetchRootKey: boolean;
  defaultHttpAgentOptions?: HttpAgentOptions;
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

    this.favorites = this._createActor<FavoritesDid._SERVICE>(
      toDidModuleType(FavoritesDid).idlFactory
    );
    this.registrar = this._createActor<RegistrarDid._SERVICE>(
      toDidModuleType(RegistrarDid).idlFactory
    );
    this.registry = this._createActor<RegistryDid._SERVICE>(
      toDidModuleType(RegistryDid).idlFactory
    );
    this.resolver = this._createActor<ResolverDid._SERVICE>(
      toDidModuleType(ResolverDid).idlFactory
    );
  }

  private _initHttpAgent() {
    return new HttpAgent({
      ...this._options.defaultHttpAgentOptions,
      // TODO: mix special options
    });
  }

  private _init_actors_before() {
    if (this._options.fetchRootKey) {
      this._httpAgent.fetchRootKey().catch((err) => {
        console.warn(
          "Unable to fetch root key. Check to ensure that your local replica is running"
        );
        console.error(err);
        // TODO: maybe throw ?
      });
    }
  }

  private _createActor<ServiceType>(factory: IDL.InterfaceFactory) {
    return Actor.createActor(factory, {
      agent: this._httpAgent,
      canisterId: this._options.canisterId,
    }) as ActorSubclass<ServiceType>;
  }
}

const toDidModuleType = <T>(module: T) => {
  return module as T & { idlFactory: IDL.InterfaceFactory };
};
