// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
  SuiObjectResponse,
  getObjectDisplay,
  getObjectId,
  getObjectType,
} from '@mysten/sui.js';
import { OwnedObjectType } from '../components/Inventory/OwnedObjects';

// Parse the result into a simple {id, display, type} format to use throughout the app.
// we omit objects without display for beautification (or without image_url :) )
export const parseObjectDisplays = (
  data: SuiObjectResponse[],
): OwnedObjectType[] => {
  return data
    .map((x) => {
      return {
        id: getObjectId(x),
        display: getObjectDisplay(x)?.data,
        type: getObjectType(x),
      } as OwnedObjectType;
    })
    .filter((x) => !!x.display && !!x.display.image_url);
};
