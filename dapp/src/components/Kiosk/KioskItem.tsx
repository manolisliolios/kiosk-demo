// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { OwnedObjectType } from '../Inventory/OwnedObjects';
import { DisplayObject } from '../DisplayObject';
import { KioskListingValue } from './KioskItems';
import { useState } from 'react';
// import { Spinner } from "../Spinner";
import { actionWithLoader } from '../../utils/buttons';
import { Button } from '../Button';

export type KioskItemProps = {
  listing?: KioskListingValue | null;
  takeFn: (item: OwnedObjectType) => void;
  listFn: (item: OwnedObjectType) => void;
  delistFn: (item: OwnedObjectType) => void;
  item: OwnedObjectType;
};

export function KioskItem({
  item,
  listing = null,
  takeFn,
  listFn,
  delistFn,
}: KioskItemProps): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <DisplayObject item={item} listing={listing}>
      <>
        {!listing && (
          <>
            <Button
              loading={loading}
              onClick={() => actionWithLoader(takeFn, item, setLoading)}
            >
              Take from Kiosk
            </Button>

            <Button
              loading={loading}
              className="btn-outline-primary"
              onClick={() => actionWithLoader(listFn, item, setLoading)}
            >
              List for Sale
            </Button>
          </>
        )}
        {listing && (
          <Button
            loading={loading}
            className="btn-outline-primary md:col-span-2"
            onClick={() => actionWithLoader(delistFn, item, setLoading)}
          >
            Delist item
          </Button>
        )}
      </>
    </DisplayObject>
  );
}
