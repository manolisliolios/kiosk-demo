// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';
import { PaginatedObjectsResponse, TransactionBlock } from '@mysten/sui.js';
import { OwnedObject } from './OwnedObject';
import { KioskData } from '../KioskData';
import { useRpc } from '../../hooks/useRpc';
import {
  getOwnedKiosk,
  getOwnedKioskCap,
  parseObjectDisplays,
} from '../../utils/utils';
import { useTransactionExecution } from '../../hooks/useTransactionExecution';
import { KioskListing, place, placeAndList } from '@mysten/kiosk';
import { ListPrice } from '../Modals/ListPrice';
import { Loading } from '../Loading';

export type OwnedObjectType = {
  id: string;
  display: Record<string, string>;
  type: string;
  listing?: KioskListing;
};

export function OwnedObjects({
  address,
}: { address: string } & KioskData): JSX.Element {
  const provider = useRpc();

  const kioskId = useMemo(() => {
    return getOwnedKiosk() || '';
  }, []);

  const kioskOwnerCap = useMemo(() => {
    return getOwnedKioskCap() || '';
  }, []);

  const [loading, setLoading] = useState<boolean>(false);
  const [ownedObjects, setOwnedObjects] = useState<OwnedObjectType[]>([]);
  const [modalItem, setModalItem] = useState<OwnedObjectType | null>(null);
  const { signAndExecute } = useTransactionExecution();

  const placeToKiosk = async (item: OwnedObjectType) => {
    if (!kioskId) return;

    const tx = new TransactionBlock();
    place(tx, item.type, kioskId, kioskOwnerCap, item.id);
    const success = await signAndExecute({ tx });
    if (success) getOwnedObjects();
  };

  const placeAndListToKiosk = async (item: OwnedObjectType, price: string) => {
    if (!kioskId) return;
    const tx = new TransactionBlock();
    placeAndList(tx, item.type, kioskId, kioskOwnerCap, item.id, price);
    const success = await signAndExecute({ tx });
    if (success) {
      getOwnedObjects();
      setModalItem(null); // replace modal.
    }
  };

  const getOwnedObjects = async () => {
    setLoading(true);
    const { data }: PaginatedObjectsResponse = await provider
      .getOwnedObjects({
        owner: address,
        options: {
          showDisplay: true,
          showType: true,
        },
      })
      .finally(() => setLoading(false));

    if (!data) return;

    setOwnedObjects(parseObjectDisplays(data));
  };

  useEffect(() => {
    getOwnedObjects();
  }, [address]);

  if (loading) return <Loading />;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {ownedObjects.map((object) => (
        <OwnedObject
          key={object.id}
          object={object}
          placeFn={placeToKiosk}
          listFn={(item: OwnedObjectType) => setModalItem(item)}
        />
      ))}

      {modalItem && (
        <ListPrice
          item={modalItem}
          onSubmit={placeAndListToKiosk}
          closeModal={() => setModalItem(null)}
        />
      )}
    </div>
  );
}
