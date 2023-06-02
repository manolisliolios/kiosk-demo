// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { ReactElement } from 'react';
import { OwnedObjectType } from './Inventory/OwnedObjects';
import { KioskListing } from '@mysten/kiosk';
import { useWalletKit } from '@mysten/wallet-kit';
import { formatSui, mistToSui } from '../utils/utils';

export interface DisplayObject {
  listing?: KioskListing | null;
  item: OwnedObjectType;
  children: ReactElement | false;
}

export function DisplayObject({
  item,
  listing = null,
  children,
}: DisplayObject): JSX.Element {
  const { currentAccount } = useWalletKit();

  const price = formatSui(mistToSui(listing?.price));

  return (
    <div className="border relative border-primary overflow-hidden text-center flex justify-between flex-col rounded-lg">
      <div className="h-[275px] xl:h-[200px] overflow-hidden bg-gray-50">
        <img
          src={item.display.image_url}
          className="object-cover aspect-auto h-full w-full mx-auto"
          alt="The display of the object"
        ></img>
      </div>

      <div className="p-4">
        {item.display.name && (
          <h3 className="text-clip overflow-hidden">{item.display.name}</h3>
        )}

        {item.display.description && (
          <p className="text-sm opacity-80 text-clip overflow-hidden">
            {item.display.description}
          </p>
        )}

        {listing && listing.price && (
          <div className="absolute left-2 top-2 bg-black text-white px-2 py-1 rounded-lg">
            {price} SUI
          </div>
        )}

        {/* button actions */}
        {currentAccount?.address ? (
          <div className="grid lg:grid-cols-2 gap-5 mt-6">{children}</div>
        ) : (
          <div className="mt-6 text-xs">Connect your wallet to interact</div>
        )}
      </div>
    </div>
  );
}
