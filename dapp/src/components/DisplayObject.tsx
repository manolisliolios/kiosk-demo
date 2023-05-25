// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { ReactElement } from 'react';
import { OwnedObjectType } from './Inventory/OwnedObjects';
import { KioskListing } from '@mysten/kiosk';

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
  return (
    <div className="border relative border-primary p-4 text-center flex justify-between flex-col rounded-xl">
      <div className="h-[200px] overflow-hidden bg-gray-50">
        <img
          src={item.display.image_url}
          className="object-contain h-full w-full md:max-w-[50%] mx-auto"
        ></img>
      </div>

      {item.display.name && (
        <h3 className="text-clip overflow-hidden">{item.display.name}</h3>
      )}

      {item.display.description && (
        <p className="text-sm opacity-80 text-clip overflow-hidden">
          {item.display.description}
        </p>
      )}

      {listing && (
        <div className="absolute left-2 top-2 bg-gray-200 px-2 py-1 rounded-2xl">
          {listing.price} SUI
        </div>
      )}

      {/* button actions */}
      <div className="grid lg:grid-cols-2 gap-5 mt-6">{children}</div>
    </div>
  );
}
