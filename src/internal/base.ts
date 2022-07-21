import { Actor, ActorConfig, ActorSubclass, HttpAgent } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
import { IcNamingClientInitOptions } from './option';
import {
  IC_LOCAL_HOST,
  IC_PUBLIC_HOST,
  IC_CANISTER_ID_GROUP,
  ICP_CANISTER_ID_GROUP,
  NetCanisterIdMapping
} from './config';

import {
  idlFactory as FavoritesIDL,
  _SERVICE as Favorites
} from '@icnaming/favorites_client';
import {
  idlFactory as RegistrarIDL,
  _SERVICE as Registrar
} from '@icnaming/registrar_client';
import {
  idlFactory as RegistryIDL,
  _SERVICE as Registry
} from '@icnaming/registry_client';
import {
  idlFactory as ResolverIDL,
  _SERVICE as Resolver
} from '@icnaming/resolver_client';

export class IcNamingClientBase {
  protected options: IcNamingClientInitOptions;

  protected favorites: Favorites;
  protected registrar: Registrar;
  protected registry: Registry;
  protected resolver: Resolver;

  private _httpAgent: HttpAgent;

  constructor(options: IcNamingClientInitOptions) {
    this.options = options;

    this._httpAgent = this._initHttpAgent();

    this._init_actors_before();

    let canisterIdMapping: NetCanisterIdMapping;

    switch (options.suffix) {
      case 'ICP':
        canisterIdMapping = ICP_CANISTER_ID_GROUP;
        break;
      case 'IC':
      default:
        canisterIdMapping = IC_CANISTER_ID_GROUP;
        break;
    }

    this.favorites = this._createActor<Favorites>(
      toDidModuleType(FavoritesIDL).idlFactory,
      canisterIdMapping.favorites
    );
    this.registrar = this._createActor<Registrar>(
      toDidModuleType(RegistrarIDL).idlFactory,
      canisterIdMapping.registrar
    );
    this.registry = this._createActor<Registry>(
      toDidModuleType(RegistryIDL).idlFactory,
      canisterIdMapping.registry
    );
    this.resolver = this._createActor<Resolver>(
      toDidModuleType(ResolverIDL).idlFactory,
      canisterIdMapping.resolver
    );
  }

  private _initHttpAgent() {
    return new HttpAgent({
      host: this.options.mode === 'local' ? IC_LOCAL_HOST : IC_PUBLIC_HOST,
      ...this.options.httpAgentOptions
    });
  }

  private _init_actors_before() {
    if (this.options.mode === 'local') {
      this._httpAgent.fetchRootKey().catch(err => {
        console.warn(
          'Unable to fetch root key. Check to ensure that your local replica is running'
        );
        console.error(err);
        // TODO: maybe throw ?
      });
    }
  }

  private _createActor<ServiceType>(
    factory: IDL.InterfaceFactory,
    canisterId: ActorConfig['canisterId']
  ) {
    return Actor.createActor(factory, {
      agent: this._httpAgent,
      canisterId
    }) as ActorSubclass<ServiceType>;
  }
}

const toDidModuleType = <T>(module: T) => {
  return module as T & { idlFactory: IDL.InterfaceFactory };
};
