import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

interface BlackwaterCreekAPIResponse {
  message?: string;
  version?: string;
}

type Props = {
  children: string
}

const Code = ({ children }: Props) => {
  return (
    <code style={{ color: 'red', opacity: 0.5, wordBreak: 'break-all', backgroundColor: 'black' }}>
      {children}
    </code>
  );
}

function App () {
  const [error, setError] = useState<string>(``)
  const [busy, setBusy] = useState<Boolean>(false)
  const [apiHost] = useState<string>(process.env.REACT_APP_BLACKWATER_CREEK_API as string)
  const [data, setData] = useState<BlackwaterCreekAPIResponse>({ message: ``, version: `` });
  const [message, setMessage] = useState<string>(``)
  const [version, setVersion] = useState<string>(``)

  useEffect(() => {
    const { message } = { message: ``, ...data }
    setMessage(`${message.substr(0,8)}...${message.substr(message.length - 8, message.length)}`)
  }, [data])

  useEffect(() => {
    const { version } = { version: ``, ...data }
    setVersion(version)
  }, [data])

  useEffect(() => {

    async function fetchData () {
      setError(``)
      setBusy(true)
      try {
        const response = await fetch(apiHost);
        const responseJson = await response.json();
        setData(responseJson)
        setBusy(false)
      } catch (error) {
        console.log(error)
        setError('Could not fetch!')
        setBusy(false)
      }
    }

    fetchData();

  }, [apiHost]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {busy && <p>busy...</p>}
        {error.length < 1 && <p>
          Got: <Code>{message}</Code>
          <br />
          From: <Code>blackwater-creek</Code>
          <br />
          API Version <Code>{version}</Code>
          <br />
          Path: <Code>{apiHost}</Code>
        </p>}
        {error.length > 0 && (<p>
          <code>{error}</code>
        </p>)}
        <a
          className="App-link"
          href={apiHost}
          target="_blank"
          rel="noopener noreferrer"
        >
          See for yourself
        </a>
      </header>
    </div>
  );
}

export default App;
