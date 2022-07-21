import { HttpAgentOptions } from "@dfinity/agent";
import { NameRecordsCacheStore } from "./cache";

export interface IcNamingClientInitOptions {
  suffix: "IC" | "ICP";
  mode: "production" | "local";
  httpAgentOptions?: HttpAgentOptions;
  enableTTL?: boolean;
  nameRecordsCacheStore?: NameRecordsCacheStore;
}
