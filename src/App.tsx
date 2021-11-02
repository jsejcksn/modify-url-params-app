import {ReactElement, useEffect, useState} from 'react';
import {css, SerializedStyles} from '@emotion/react';

import {getQueryEntries} from './util';

import {CopyButton} from './components/CopyButton';
import {QueryParams, ToggledEntry} from './components/QueryParams';

const styles: Record<string, SerializedStyles> = {};

styles.app = css`
  padding: 2rem 1rem 4rem;

  & a {
    color: var(--color-accent);
    text-decoration-style: underline;
    text-decoration-color: transparent;

    &:hover {
      text-decoration-color: var(--color-accent);
    }
  }
`;

styles.section = css`
  margin: 2rem 0;
`;

styles.input = css`
  background-color: inherit;
  border: 1px solid var(--color-fg);
  border-radius: 0.25rem;
  color: inherit;
  font-family: var(--font-mono);
  font-size: 1rem;
  outline: none;
  padding: 0.5rem;
  width: 100%;
  max-width: 50rem;
  transition: all 150ms;

  &:hover {
    background-color: var(--color-bg-subtle-2);
  }

  &:focus {
    background-color: var(--color-bg-subtle);
    border-color: var(--color-accent);
  }
`;

styles.result = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export function App (): ReactElement {
  const [address, setAddress] = useState('');
  const [url, setUrl] = useState<URL | undefined>();
  const [message, setMessage] = useState('');
  const [queryEntries, setQueryEntries] = useState<ToggledEntry[]>([]);
  const [resultAddress, setResultAddress] = useState(address);

  useEffect(() => {
    const address = new URL(window.location.href).searchParams.get('url') ?? '';
    setAddress(address);
  }, []);

  useEffect(() => {
    if (!address) {
      setUrl(undefined);
      setMessage('Input a URL to get started');
      return;
    }

    try {
      const url = new URL(address);
      setUrl(url);
      const entries = getQueryEntries(url.href);
      setQueryEntries(entries.map<ToggledEntry>(entry => [true, entry]));
      setMessage(entries.length === 0
        ? 'No query parameters found in URL'
        : '');
    }
    catch {
      setUrl(undefined);
      setMessage('The URL could not be parsed');
    }
  }, [address, setMessage, setQueryEntries, setUrl]);

  useEffect(() => {
    if (!url) {
      setResultAddress('');
      return;
    }

    const enabledEntries = queryEntries
      .filter(([enabled]) => enabled)
      .map(([, entry]) => entry);

    const params = new URLSearchParams(enabledEntries);
    const resultUrl = new URL(url.href);
    resultUrl.search = params.toString();
    setResultAddress(resultUrl.href);
  }, [queryEntries, setResultAddress, url]);

  return (
    <div css={styles.app}>
      <header css={styles.section}>
        <h1>Modify URL Parameters</h1>
      </header>
      <div css={styles.section}>
        <input
          css={styles.input}
          onChange={ev => setAddress(ev.target.value)}
          placeholder="https://hostna.me/path?param1=value1&param2=value2"
          type="url"
          value={address}
        />
      </div>
      <div css={styles.section}>
        {
          message
            ? (<div>{message}</div>)
            : (<QueryParams
                entries={queryEntries}
                setEntries={setQueryEntries}
              />)
        }
      </div>
      {
        resultAddress
          ? (
            <div css={[styles.section, styles.result]}>
              <a href={resultAddress}>{resultAddress}</a>
              <CopyButton text={resultAddress} />
            </div>
          )
          : null
      }
    </div>
  );
}

export default App;
