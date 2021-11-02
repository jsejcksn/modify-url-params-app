import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import {css, SerializedStyles} from '@emotion/react';

import {Entry} from '../util';

import {EntryItem} from './EntryItem';

const styles: Record<string, SerializedStyles> = {};

styles.checkboxLabel = css`
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-weight: bold;
  margin-bottom: 1rem;
  padding: 0.5rem;
  transition: all 150ms;
  user-select: none;

  &:hover {
    background-color: var(--color-bg-subtle-2);
  }
`;

styles.checkbox = css`
  cursor: pointer;
  flex-shrink: 0;
`;

styles.list = css`
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
`;

export type ToggledEntry = [enabled: boolean, entry: Entry];

export type Props = {
  entries: ToggledEntry[];
  setEntries: Dispatch<SetStateAction<ToggledEntry[]>>;
};

export function QueryParams (props: Props): ReactElement {
  const {entries, setEntries} = props;
  const [allSelected, setAllSelected] = useState(true);
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const enabledCount = entries.reduce((count, [enabled]) => count + (enabled ? 1 : 0), 0);

    switch (enabledCount) {
      case 0: {
        setAllSelected(false);
        setIsIndeterminate(false);
        break;
      }
      case entries.length: {
        setAllSelected(true);
        setIsIndeterminate(false);
        break;
      }
      default: {
        setAllSelected(true);
        setIsIndeterminate(true);
        break;
      }
    }
  }, [entries, setAllSelected, setIsIndeterminate]);

  useEffect(() => {
    const checkbox = checkboxRef.current;
    if (!checkbox) return;
    checkbox.indeterminate = isIndeterminate;
  }, [isIndeterminate]);
  
  const toggleAll = (): void => {
    if (isIndeterminate || allSelected) {
      setEntries(entries => entries.map(([, entry]) => [false, entry]));
      setAllSelected(false);
    }
    else {
      setEntries(entries => entries.map(([, entry]) => [true, entry]));
      setAllSelected(true);
    }
    setIsIndeterminate(false);
  };
  
  return (
    <div>
      <label
        css={styles.checkboxLabel}
        style={entries.length > 1 ? undefined : {display: 'none'}}
      >
        <input
          checked={allSelected}
          css={styles.checkbox}
          onChange={toggleAll}
          ref={checkboxRef}
          type="checkbox"
        /><span>{
          (isIndeterminate || allSelected)
            ? 'Disable all'
            : 'Enable all'
          // 'All'
        }</span>
      </label>
      <ul css={styles.list}>{
        entries.map(([enabled, entry], index) => {
          const toggle = (): void => {
            setEntries(entries => entries.map((toggledEntry, i) => i === index ? [!enabled, entry] : toggledEntry));
          };

          return (
            <li key={`${index}.${entry[0]}`}>
              <EntryItem {...{enabled, entry, toggle}} />
            </li>
          );
        })
      }</ul>
    </div>
  );
}

export default QueryParams;
