export const idlFactory = ({ IDL }) => {
  const QuotaType = IDL.Variant({ 'LenEq' : IDL.Nat8, 'LenGte' : IDL.Nat8 });
  const ErrorInfo = IDL.Record({ 'code' : IDL.Nat32, 'message' : IDL.Text });
  const Result = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : ErrorInfo });
  const GetPageInput = IDL.Record({
    'offset' : IDL.Nat64,
    'limit' : IDL.Nat64,
  });
  const RegistrationDetails = IDL.Record({
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'created_at' : IDL.Nat64,
    'expired_at' : IDL.Nat64,
  });
  const Result_1 = IDL.Variant({
    'Ok' : IDL.Vec(RegistrationDetails),
    'Err' : ErrorInfo,
  });
  const Result_2 = IDL.Variant({
    'Ok' : RegistrationDetails,
    'Err' : ErrorInfo,
  });
  const Result_3 = IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : ErrorInfo });
  const RegistrationDto = IDL.Record({
    'name' : IDL.Text,
    'created_at' : IDL.Nat64,
    'expired_at' : IDL.Nat64,
  });
  const GetPageOutput = IDL.Record({ 'items' : IDL.Vec(RegistrationDto) });
  const Result_4 = IDL.Variant({ 'Ok' : GetPageOutput, 'Err' : ErrorInfo });
  const Result_5 = IDL.Variant({ 'Ok' : IDL.Principal, 'Err' : ErrorInfo });
  const Result_6 = IDL.Variant({ 'Ok' : IDL.Nat32, 'Err' : ErrorInfo });
  return IDL.Service({
    'add_quota' : IDL.Func([IDL.Principal, QuotaType, IDL.Nat32], [Result], []),
    'available' : IDL.Func([IDL.Text], [Result], ['query']),
    'get_all_details' : IDL.Func([GetPageInput], [Result_1], ['query']),
    'get_details' : IDL.Func([IDL.Text], [Result_2], ['query']),
    'get_name_expires' : IDL.Func([IDL.Text], [Result_3], ['query']),
    'get_names' : IDL.Func(
        [IDL.Principal, GetPageInput],
        [Result_4],
        ['query'],
      ),
    'get_owner' : IDL.Func([IDL.Text], [Result_5], ['query']),
    'get_quota' : IDL.Func([IDL.Principal, QuotaType], [Result_6], ['query']),
    'register_for' : IDL.Func(
        [IDL.Text, IDL.Principal, IDL.Nat64],
        [Result],
        [],
      ),
    'register_with_quota' : IDL.Func([IDL.Text, QuotaType], [Result], []),
    'sub_quota' : IDL.Func([IDL.Principal, QuotaType, IDL.Nat32], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
