/** @jsxImportSource @emotion/react */

import type {ReactElement} from 'react';
import {css, SerializedStyles} from '@emotion/react';

import type {Entry} from '../util';

const styles: Record<string, SerializedStyles> = {};

styles.entry = css`
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.5rem;
  transition: all 150ms;

  &:hover {
    background-color: var(--color-bg-subtle-2);
  }
`;

styles.kv = css`
  background-color: var(--color-bg-subtle);
  border-radius: 0.25rem;
  font-family: var(--font-mono);
  padding: 0.1em 0.2em;
`;

styles.key = css`
  ${styles.kv};
`;

styles.value = css`
  ${styles.kv};
`;

styles.checkbox = css`
  cursor: pointer;
  flex-shrink: 0;
`;

export type Props = {
  enabled: boolean;
  entry: Entry;
  toggle: () => void;
};

export function EntryItem (props: Props): ReactElement {
  const {enabled, entry: [key, value], toggle} = props;

  return (
    <div>
      <label css={styles.entry}>
        <input
          checked={enabled}
          css={styles.checkbox}
          onChange={toggle}
          type="checkbox"
        /><span css={styles.key}>{key}</span>=<span css={styles.value}>{value}</span>
      </label>
    </div>
  );
}

export default EntryItem;
