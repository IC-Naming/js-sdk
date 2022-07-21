import { Principal } from '@dfinity/principal';
import { IcNamingClient, InMemoryNameRecordsCacheStore } from '../src';

jest.mock('../src/internal/base');

const dummyPrincipal = Principal.fromText('crp26-tyaaa-aaaam-aacbq-cai');

describe('IcNamingClient', () => {
  it('should naming available', async () => {
    const client = new IcNamingClient({ suffix: 'ICP', mode: 'local' });

    client['registrar'] = { available: () => {} } as any;

    jest
      .spyOn(client['registrar'], 'available')
      .mockResolvedValue({ Ok: true });

    await expect(client.isAvailableNaming('naming')).resolves.toBeTruthy();
    expect(client['registrar'].available).toBeCalledTimes(1);
  });

  it('should return expired time', async () => {
    const client = new IcNamingClient({ suffix: 'ICP', mode: 'local' });

    client['registrar'] = { get_name_expires: () => {} } as any;

    jest
      .spyOn(client['registrar'], 'get_name_expires')
      .mockResolvedValue({ Ok: BigInt(123) });

    await expect(client.getExpiredTimeOfName('name')).resolves.toBe(
      BigInt(123)
    );
    expect(client['registrar'].get_name_expires).toBeCalledTimes(1);
  });

  it('should return names of registrant', async () => {
    const client = new IcNamingClient({ suffix: 'ICP', mode: 'local' });

    client['registrar'] = { get_names: () => {} } as any;

    jest.spyOn(client['registrar'], 'get_names').mockResolvedValue({
      Ok: {
        items: [
          {
            name: 'name1',
            created_at: BigInt(123),
            expired_at: BigInt(456)
          }
        ]
      }
    });

    await expect(
      client.getNamesOfRegistrant(dummyPrincipal, {
        offset: BigInt(0),
        limit: BigInt(100)
      })
    ).resolves.toMatchObject([
      {
        name: 'name1',
        created_at: BigInt(123),
        expired_at: BigInt(456)
      }
    ]);
    expect(client['registrar'].get_names).toBeCalledTimes(1);
  });

  it('should return names of controller', async () => {
    const client = new IcNamingClient({ suffix: 'ICP', mode: 'local' });

    client['registry'] = { get_controlled_names: () => {} } as any;

    jest.spyOn(client['registry'], 'get_controlled_names').mockResolvedValue({
      Ok: {
        items: ['name1', 'name2', 'name3']
      }
    });

    await expect(
      client.getNamesOfController(dummyPrincipal, {
        offset: BigInt(0),
        limit: BigInt(100)
      })
    ).resolves.toMatchObject(['name1', 'name2', 'name3']);
    expect(client['registry'].get_controlled_names).toBeCalledTimes(1);
  });

  it('should return registrant of name', async () => {
    const client = new IcNamingClient({ suffix: 'ICP', mode: 'local' });

    client['registrar'] = { get_owner: () => {} } as any;

    jest.spyOn(client['registrar'], 'get_owner').mockResolvedValue({
      Ok: dummyPrincipal
    });

    await expect(client.getRegistrantOfName('name')).resolves.toBe(
      dummyPrincipal
    );
    expect(client['registrar'].get_owner).toBeCalledTimes(1);
  });

  it('should return controller of name', async () => {
    const client = new IcNamingClient({ suffix: 'ICP', mode: 'local' });

    client['registry'] = { get_owner: () => {} } as any;

    jest.spyOn(client['registry'], 'get_owner').mockResolvedValue({
      Ok: dummyPrincipal
    });

    await expect(client.getControllerOfName('name')).resolves.toBe(
      dummyPrincipal
    );
    expect(client['registry'].get_owner).toBeCalledTimes(1);
  });

  it('should return resolver of name', async () => {
    const client = new IcNamingClient({ suffix: 'ICP', mode: 'local' });

    client['registry'] = { get_resolver: () => {} } as any;

    jest.spyOn(client['registry'], 'get_resolver').mockResolvedValue({
      Ok: dummyPrincipal
    });

    await expect(client.getResolverOfName('name')).resolves.toBe(
      dummyPrincipal
    );
    expect(client['registry'].get_resolver).toBeCalledTimes(1);
  });

  it('should return registration detail of name', async () => {
    const client = new IcNamingClient({ suffix: 'ICP', mode: 'local' });

    client['registrar'] = { get_details: () => {} } as any;

    jest.spyOn(client['registrar'], 'get_details').mockResolvedValue({
      Ok: {
        owner: dummyPrincipal,
        name: 'name',
        created_at: BigInt(123),
        expired_at: BigInt(456)
      }
    });

    await expect(client.getRegistrationOfName('name')).resolves.toMatchObject({
      owner: dummyPrincipal,
      name: 'name',
      created_at: BigInt(123),
      expired_at: BigInt(456)
    });
    expect(client['registrar'].get_details).toBeCalledTimes(1);
  });

  it('should return records of name', async () => {
    const client = new IcNamingClient({ suffix: 'ICP', mode: 'local' });

    client['resolver'] = { get_record_value: () => {} } as any;

    jest.spyOn(client['resolver'], 'get_record_value').mockResolvedValue({
      Ok: [
        ['key1', 'value1'],
        ['key2', 'value2'],
        ['key3', 'value3']
      ]
    });

    await expect(client.getRecordsOfName('name')).resolves.toMatchObject([
      ['key1', 'value1'],
      ['key2', 'value2'],
      ['key3', 'value3']
    ]);
    expect(client['resolver'].get_record_value).toBeCalledTimes(1);
  });

  it('should return records of name with cache store', async () => {
    const inMemoryStore = new InMemoryNameRecordsCacheStore();

    const spyStoreGet = jest.spyOn(inMemoryStore, 'getRecordsByName');
    const spyStoreSet = jest.spyOn(inMemoryStore, 'setRecordsByName');

    const client = new IcNamingClient({
      suffix: 'ICP',
      mode: 'local',
      enableTTL: true,
      nameRecordsCacheStore: inMemoryStore
    });

    client['resolver'] = { get_record_value: () => {} } as any;
    const spyDispatchNameRecordsCachet = jest.spyOn(
      client,
      'dispatchNameRecordsCache' as any
    );
    client['getRegistryOfName'] = jest.fn().mockResolvedValue({
      ttl: BigInt(600),
      resolver: dummyPrincipal,
      owner: dummyPrincipal,
      name: 'name'
    });

    jest.spyOn(client['resolver'], 'get_record_value').mockResolvedValue({
      Ok: [
        ['key1', 'value1'],
        ['key2', 'value2'],
        ['key3', 'value3']
      ]
    });

    await expect(client.getRecordsOfName('name')).resolves.toMatchObject([
      ['key1', 'value1'],
      ['key2', 'value2'],
      ['key3', 'value3']
    ]);
    expect(spyDispatchNameRecordsCachet).toHaveBeenCalledTimes(2);
    expect(client['resolver'].get_record_value).toBeCalledTimes(1);
    expect(client['getRegistryOfName']).toBeCalledTimes(1);
    expect(spyStoreGet).toBeCalledTimes(2);
    expect(spyStoreSet).toBeCalledTimes(2);

    await expect(client.getRecordsOfName('name')).resolves.toMatchObject([
      ['key1', 'value1'],
      ['key2', 'value2'],
      ['key3', 'value3']
    ]);
    expect(spyDispatchNameRecordsCachet).toHaveBeenCalledTimes(2 + 1);
    expect(client['resolver'].get_record_value).toBeCalledTimes(1 + 0);
    expect(client['getRegistryOfName']).toBeCalledTimes(1 + 0);
    expect(spyStoreGet).toBeCalledTimes(2 + 1);
    expect(spyStoreSet).toBeCalledTimes(2 + 0);

    inMemoryStore.map['name'].expired_at = Date.now();

    await expect(client.getRecordsOfName('name')).resolves.toMatchObject([
      ['key1', 'value1'],
      ['key2', 'value2'],
      ['key3', 'value3']
    ]);
    expect(spyDispatchNameRecordsCachet).toHaveBeenCalledTimes(2 + 1 + 2);
    expect(client['resolver'].get_record_value).toBeCalledTimes(1 + 0 + 1);
    expect(client['getRegistryOfName']).toBeCalledTimes(1 + 0 + 1);
    expect(spyStoreGet).toBeCalledTimes(2 + 1 + 2);
    expect(spyStoreSet).toBeCalledTimes(2 + 0 + 2);
  });

  it('should return registry of name', async () => {
    const client = new IcNamingClient({
      suffix: 'ICP',
      mode: 'local'
    });

    client['registry'] = { get_details: () => {} } as any;

    jest.spyOn(client['registry'], 'get_details').mockResolvedValue({
      Ok: {
        ttl: BigInt(600),
        resolver: dummyPrincipal,
        owner: dummyPrincipal,
        name: 'name'
      }
    });

    await expect(client.getRegistryOfName('name')).resolves.toMatchObject({
      ttl: BigInt(600),
      resolver: dummyPrincipal,
      owner: dummyPrincipal,
      name: 'name'
    });
    expect(client['registry'].get_details).toBeCalledTimes(1);
  });

  it('should return prices', async () => {
    const client = new IcNamingClient({
      suffix: 'ICP',
      mode: 'local'
    });

    client['registrar'] = { get_price_table: () => {} } as any;

    jest.spyOn(client['registrar'], 'get_price_table').mockResolvedValue({
      Ok: {
        icp_xdr_conversion_rate: BigInt(1),
        items: [
          {
            len: 8,
            price_in_icp_e8s: BigInt(1),
            price_in_xdr_permyriad: BigInt(1)
          }
        ]
      }
    });

    await expect(client.getRegistrarPrices()).resolves.toMatchObject([
      {
        len: 8,
        price_in_icp_e8s: BigInt(1),
        price_in_xdr_permyriad: BigInt(1)
      }
    ]);
    expect(client['registrar'].get_price_table).toBeCalledTimes(1);
  });

  it('should return favorites', async () => {
    const client = new IcNamingClient({
      suffix: 'ICP',
      mode: 'local'
    });

    client['favorites'] = { get_favorites: () => {} } as any;

    jest.spyOn(client['favorites'], 'get_favorites').mockResolvedValue({
      Ok: ['hello', 'world']
    });

    await expect(client.getFavoriteNames()).resolves.toMatchObject([
      'hello',
      'world'
    ]);
    expect(client['favorites'].get_favorites).toBeCalledTimes(1);
  });

  it('should not enableTTL by default', () => {
    const client = new IcNamingClient({
      suffix: 'ICP',
      mode: 'local'
    });

    expect(client['nameRecordsCacheStore']).toBeFalsy();
  });

  it('should not enableTTL by default', () => {
    const client = new IcNamingClient({
      suffix: 'ICP',
      mode: 'local',
      enableTTL: true
    });

    expect(client['nameRecordsCacheStore']).toBeTruthy();
  });
});
