// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { ReactElement } from 'react';
import { OwnedObjectType } from './Inventory/OwnedObjects';
import { KioskListing } from '@mysten/kiosk';
import { MIST_PER_SUI } from '@mysten/sui.js';
import { useWalletKit } from '@mysten/wallet-kit';

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

  const price = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
  }).format(+(listing?.price || 0) / +MIST_PER_SUI.toString());
  return (
    <div className="border relative border-primary overflow-hidden text-center flex justify-between flex-col rounded-lg">
      <div className="h-[275px] xl:h-[200px] overflow-hidden bg-gray-50">
        <img
          src={item.display.image_url}
          className="object-cover aspect-auto h-full w-full mx-auto"
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
          <div className="absolute left-2 top-2 bg-gray-200 px-2 py-1 rounded-lg">
            {price} SUI
          </div>
        )}

        {/* button actions */}
        {currentAccount?.address && (
          <div className="grid lg:grid-cols-2 gap-5 mt-6">{children}</div>
        )}
      </div>
    </div>
  );
}
