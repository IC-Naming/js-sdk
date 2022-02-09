import type { Principal } from '@dfinity/principal';
export interface ErrorInfo { 'code' : number, 'message' : string }
export interface GetPageInput { 'offset' : bigint, 'limit' : bigint }
export interface GetPageOutput { 'items' : Array<RegistrationDto> }
export type QuotaType = { 'LenEq' : number } |
  { 'LenGte' : number };
export interface RegistrationDetails {
  'owner' : Principal,
  'name' : string,
  'created_at' : bigint,
  'expired_at' : bigint,
}
export interface RegistrationDto {
  'name' : string,
  'created_at' : bigint,
  'expired_at' : bigint,
}
export type Result = { 'Ok' : boolean } |
  { 'Err' : ErrorInfo };
export type Result_1 = { 'Ok' : Array<RegistrationDetails> } |
  { 'Err' : ErrorInfo };
export type Result_2 = { 'Ok' : RegistrationDetails } |
  { 'Err' : ErrorInfo };
export type Result_3 = { 'Ok' : bigint } |
  { 'Err' : ErrorInfo };
export type Result_4 = { 'Ok' : GetPageOutput } |
  { 'Err' : ErrorInfo };
export type Result_5 = { 'Ok' : Principal } |
  { 'Err' : ErrorInfo };
export type Result_6 = { 'Ok' : number } |
  { 'Err' : ErrorInfo };
export interface _SERVICE {
  'add_quota' : (arg_0: Principal, arg_1: QuotaType, arg_2: number) => Promise<
      Result
    >,
  'available' : (arg_0: string) => Promise<Result>,
  'get_all_details' : (arg_0: GetPageInput) => Promise<Result_1>,
  'get_details' : (arg_0: string) => Promise<Result_2>,
  'get_name_expires' : (arg_0: string) => Promise<Result_3>,
  'get_names' : (arg_0: Principal, arg_1: GetPageInput) => Promise<Result_4>,
  'get_owner' : (arg_0: string) => Promise<Result_5>,
  'get_quota' : (arg_0: Principal, arg_1: QuotaType) => Promise<Result_6>,
  'register_for' : (arg_0: string, arg_1: Principal, arg_2: bigint) => Promise<
      Result
    >,
  'register_with_quota' : (arg_0: string, arg_1: QuotaType) => Promise<Result>,
  'sub_quota' : (arg_0: Principal, arg_1: QuotaType, arg_2: number) => Promise<
      Result
    >,
}
