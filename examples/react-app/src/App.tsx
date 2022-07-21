import { useEffect, useMemo, useState } from 'react';
import { IcNamingClient } from '@ic-naming/client';
import logo from './logo.png';
import './App.css';

function App() {
  const client = useMemo(() => {
    return new IcNamingClient({
      net: 'IC',
      mode: 'production',
      enableTTL: true
    });
  }, []);

  const [keyword, setKeyword] = useState('');
  const [log, setLog] = useState('Input please');

  useEffect(() => {
    let cancel = false;

    const fn = async () => {
      setLog('Input please');

      if (!keyword) return;

      setLog('Loading ...');

      let result;
      try {
        result = await client.isAvailableNaming(keyword + '.icp');
      } catch (error) {
        if (cancel) return;
        setLog((error as Error).message);

        throw error;
      }

      if (cancel) return;
      setLog(result ? 'Available' : 'Not Available');
    };

    fn();

    return () => {
      cancel = true;
    };
  }, [client, keyword]);

  const [records, setRecords] = useState<string | Array<[string, string]>>('');

  useEffect(() => {
    let cancel = false;

    const fn = async () => {
      setRecords('');

      if (!(keyword && log.includes('has been taken'))) return;

      setRecords('Loading Records ...');

      let result;
      try {
        result = await client.getRecordsOfName(keyword + '.icp');
      } catch (error) {
        if (cancel) return;
        setRecords((error as Error).message);

        throw error;
      }

      if (cancel) return;
      setRecords(result);
    };

    fn();

    return () => {
      cancel = true;
    };
  }, [log, keyword, client]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Example: A "React App" for search naming</p>

        <div className="search-input-wrapper">
          <div className="search-input">
            <input
              placeholder="Search names or addresses"
              value={keyword}
              onChange={e => setKeyword(e.currentTarget.value)}
            />
          </div>
        </div>

        <div style={{ margin: '0 10px 50px' }}>{log}</div>

        <div style={{ margin: '20px 10px 100px', fontSize: '16px' }}>
          {typeof records == 'string' ? (
            records
          ) : records.length ? (
            <>
              <p>Have {records.length} record(s):</p>
              <ul>
                {records.map(([key, value]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            'Have Not Records'
          )}
        </div>

        <a
          className="App-link"
          href="https://app.icnaming.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to IC-Naming home
        </a>
      </header>
    </div>
  );
}

export default App;
