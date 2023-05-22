// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { OwnedObjectType } from './Inventory/OwnedObjects';

export function DisplayObjectThumbnail({ item }: { item: OwnedObjectType }) {
  return (
    <div className="flex gap-5 items-center ">
      <div className="bg-gray-100 w-[100px] h-[50px] overflow-hidden rounded-2xl my-6">
        <img
          src={item.display.image_url}
          className="object-contain object-center w-full h-full"
        ></img>
      </div>
      <div>
        <label>Selected Item</label>
        <p>Name: {item.display.name}</p>
        <p>Description: {item.display.description}</p>
      </div>
    </div>
  );
}
