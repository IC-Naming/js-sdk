export interface NameRecordsValue {
  name: string;
  expired_at: number;
  records?: Array<{ key: string; value: string }>;
}

export interface NameRecordsCacheStore {
  getRecordsByName: (name: string) => Promise<null | NameRecordsValue>;
  setRecordsByName: (name: string, data: NameRecordsValue) => Promise<void>;
}
