import { HttpAgentOptions } from "@dfinity/agent";
import { NameRecordsCacheStore } from "./cache";

export interface IcNamingClientInitOptions {
  net: "MAINNET" | "TICP";
  mode: "production" | "local";
  httpAgentOptions?: HttpAgentOptions;
  enableTTL?: boolean;
  nameRecordsCacheStore?: NameRecordsCacheStore;
}
