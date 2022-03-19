import React, { useEffect, useMemo, useState } from "react";
import { IcNamingClient } from "@ic-naming/client";
import logo from "./logo.png";
import "./App.css";

function App() {
  const client = useMemo(
    () =>
      new IcNamingClient({
        net: "MAINNET",
        mode: "production",
      }),
    []
  );

  const [keyword, setKeyword] = useState("");
  const [log, setLog] = useState("Input please");

  useEffect(() => {
    let cancel = false;

    const fn = async () => {
      setLog("Input please");

      if (!keyword) return;

      setLog("Loading ...");

      let result;
      try {
        result = await client.isAvailableNaming(keyword + ".icp");
      } catch (error) {
        if (cancel) return;
        setLog((error as Error).message);

        throw error;
      }

      if (cancel) return;
      setLog(result ? "Available" : "Not Available");
    };

    fn();

    return () => {
      cancel = true;
    };
  }, [client, keyword]);

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
              onChange={(e) => setKeyword(e.currentTarget.value)}
            />
          </div>
        </div>

        <p style={{ margin: "0 10px 100px" }}>{log}</p>

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
