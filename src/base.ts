import {
  Actor,
  ActorSubclass,
  HttpAgent,
  HttpAgentOptions,
} from "@dfinity/agent";
import { IDL } from "@dfinity/candid";
import { Principal } from "@dfinity/principal";

import FavoritesDid from "./canisters/favorites/favorites.did";
import RegistrarDid from "./canisters/registrar/registrar.did";
import RegistryDid from "./canisters/registry/registry.did";
import ResolverDid from "./canisters/resolver/resolver.did";

export interface IcNamingClientInitOptions {
  canisterId: string | Principal;
  fetchRootKey: boolean; // Fetch root key for certificate validation during development
  defaultHttpAgentOptions?: HttpAgentOptions;
}

export class IcNamingClientBase {
  private _options: IcNamingClientInitOptions;
  private _httpAgent: HttpAgent;

  protected _favorites_actor;
  protected _registrar_actor;
  protected _registry_actor;
  protected _resolver_actor;

  constructor(options: IcNamingClientInitOptions) {
    this._options = options;

    this._httpAgent = this._initHttpAgent();

    this._init_actors_before();

    this._favorites_actor = this._createActor<FavoritesDid._SERVICE>(
      toDidModuleType(FavoritesDid).idlFactory
    );
    this._registrar_actor = this._createActor<RegistrarDid._SERVICE>(
      toDidModuleType(RegistrarDid).idlFactory
    );
    this._registry_actor = this._createActor<RegistryDid._SERVICE>(
      toDidModuleType(RegistryDid).idlFactory
    );
    this._resolver_actor = this._createActor<ResolverDid._SERVICE>(
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

/* Utils */

const toDidModuleType = <T>(module: T) => {
  return module as T & { idlFactory: IDL.InterfaceFactory };
};

export const throwableCanisterResult = <ResultType extends { Err?: boolean }>(
  result: ResultType
) => {
  if (result.Err) {
    throw new IcNamingCanisterError(result);
  }
};

/* Custom Errors */

export class IcNamingError extends Error {}
// More error type eg: `export class IcNamingInternalError extends IcNamingError {}`

export class IcNamingCanisterError extends IcNamingError {
  theIcNamingCanisterErrorResult: unknown;

  constructor(rawResult: unknown) {
    super("IcNamingCanisterError"); // TODO: better message info
    this.theIcNamingCanisterErrorResult = rawResult;
  }
}
