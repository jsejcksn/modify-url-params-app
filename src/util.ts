export type Entry = [key: string, value: string];

export function wait (delayMs: number): Promise<void> {
  return new Promise<void>(res => setTimeout(res, delayMs));
}

export function sortByLowercaseKey (entryA: Entry, entryB: Entry): number {
  const a = entryA[0].toLowerCase();
  const b = entryB[0].toLowerCase();

  return a < b ? -1
    : b < a ? 1
    : 0;
}

export function getQueryEntries (address: string): Entry[] {
  const entries = [...new URL(address).searchParams.entries()];
  return entries;
}

export function getFragmentEntries (address: string): Entry[] {
  const entries: Entry[] = [];

  const fragment = new URL(address).hash.slice(1);
  const pairs = fragment.split('&').map(str => str.split('='));

  for (const pair of pairs) {
    if (pair.length !== 2) continue;
    const [key, value] = pair;
    entries.push([key, decodeURIComponent(value)]);
  }

  return entries;
}

export async function copyToClipboard (data: any): Promise<boolean> {
  try {
    const coercibleTypes = ['bigint', 'function', 'string', 'symbol', 'undefined'];
    const text = coercibleTypes.includes(typeof data)
      ? String(data)
      : JSON.stringify(data);
    await navigator.clipboard.writeText(text);
    return true;
  }
  catch {
    return false;
  }
}
