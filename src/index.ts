import { IcNamingClientBase } from "./base";

export class IcNamingClient extends IcNamingClientBase {
  hello() {
    this._favorites_actor.add_favorite("hello");
  }
}
