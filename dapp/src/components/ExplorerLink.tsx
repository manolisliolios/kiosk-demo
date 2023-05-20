// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

type LinkOptions =
  | { address: string; text: string }
  | { object: string; text: string };

/**
 * A link to explorer (should track env and set correct network).
 */
export function ExplorerLink(opts: LinkOptions) {
  let link =
    'address' in opts
      ? `https://suiexplorer.com/address/${opts.address}?network=testnet`
      : `https://suiexplorer.com/object/${opts.object}?network=testnet`;

  return (<a href={link} className="underline" target="_blank" rel="noreferrer">
    {opts.text}
  </a>);
}
