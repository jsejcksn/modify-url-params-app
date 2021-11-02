/** @jsxImportSource @emotion/react */

import {ReactElement, useEffect, useState} from 'react';
import {css, SerializedStyles} from '@emotion/react';

import {copyToClipboard} from '../util';

const styles: Record<string, SerializedStyles> = {};

styles.button = css`
  background-color: var(--color-fg);
  border: 0;
  border-radius: 100vw;
  color: var(--color-bg);
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  padding: 1rem;
  text-transform: uppercase;
  width: 10rem;
`;

export type Props = {
  text: string;
};

export function CopyButton (props: Props): ReactElement {
  const {text} = props;
  const [success, setSuccess] = useState<boolean | undefined>();
  const [timerId, setTimerId] = useState(0);

  useEffect(() => () => clearTimeout(timerId), [timerId]);

  const handleClick = async (): Promise<void> => {
    const wasCopied = await copyToClipboard(text);
    setSuccess(wasCopied);
    const revertDelay = 1000 * 1.5;
    const timerId = window.setTimeout(() => setSuccess(undefined), revertDelay);
    setTimerId(timerId);
  };

  return (
    <button
      css={styles.button}
      onClick={handleClick}
    >{
      typeof success === 'boolean'
        ? (success ? 'Copied' : 'Not copied')
        : 'Copy'
    }</button>
  );
}

export default CopyButton;
