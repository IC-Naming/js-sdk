import { resolver } from "./canisters/resolver";

export const call_GetRecordValue = () => {
  resolver.get_record_value("test");
};

export const VARIABLE_TEST = 1;

export const FUNCTION_TEST = (argument: string) => {
  return argument;
};
