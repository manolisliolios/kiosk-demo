// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';

type LinkOptions =
  | { address: string; text: string }
  | { object: string; text: string };

/**
 * A link to explorer (should track env and set correct network).
 */
export function ExplorerLink(opts: LinkOptions) {
  const [copied, setCopied] = useState<boolean>(false);
  const link =
    'address' in opts
      ? `https://suiexplorer.com/address/${opts.address}?network=testnet`
      : `https://suiexplorer.com/object/${opts.object}?network=testnet`;

  const copyToClipboard = async () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    await navigator.clipboard.writeText(opts?.address || opts?.object);
  };
  return (
    <>
      <a href={link} className="underline" target="_blank" rel="noreferrer">
        {opts.text}
      </a>
      <button className="!p-1 ml-3 text-xs" onClick={copyToClipboard}>
        {copied ? 'copied' : 'copy'}
      </button>
    </>
  );
}
