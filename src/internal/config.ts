export const IC_PUBLIC_HOST = "https://ic0.app";
export const IC_LOCAL_HOST = "http://127.0.0.1:8000";

export interface NetCanisterIdMapping {
  registrar: string;
  registry: string;
  resolver: string;
  favorites: string;
}

// TODO : update canister id
export const IC_CANISTER_ID_GROUP: NetCanisterIdMapping = {
  registrar: "ft6xr-taaaa-aaaam-aafmq-cai",
  registry: "f542z-iqaaa-aaaam-aafnq-cai",
  resolver: "fi3lu-jyaaa-aaaam-aafoa-cai",
  favorites: "fu7rf-6yaaa-aaaam-aafma-cai",
};

export const ICP_CANISTER_ID_GROUP: NetCanisterIdMapping = {
  registrar: "cymrc-fqaaa-aaaam-aacaa-cai",
  registry: "c7nxw-iiaaa-aaaam-aacaq-cai",
  resolver: "cwo4k-6aaaa-aaaam-aacba-cai",
  favorites: "crp26-tyaaa-aaaam-aacbq-cai",
};

export const TICP_CANISTER_ID_GROUP: NetCanisterIdMapping = {
  registrar: "onof3-pyaaa-aaaal-qac6a-cai",
  registry: "cxnwn-diaaa-aaaag-aabaq-cai",
  resolver: "okpdp-caaaa-aaaal-qac6q-cai",
  favorites: "oyjuw-oqaaa-aaaal-qac5q-cai",
};
