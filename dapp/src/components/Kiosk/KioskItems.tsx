// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { KioskData, delist, fetchKiosk, list, take } from '@mysten/kiosk';
import { KioskData as LocalKioskDataParams } from '../KioskData';
import { useRpc } from '../../hooks/useRpc';
import { useEffect, useState } from 'react';
import { KioskItem as KioskItemCmp } from './KioskItem';
import {
  SuiObjectResponse,
  TransactionBlock,
  getObjectFields,
} from '@mysten/sui.js';
import { ListPrice } from '../Modals/ListPrice';
import { OwnedObjectType } from '../Inventory/OwnedObjects';
import { parseObjectDisplays } from '../../utils/utils';
import { useTransactionExecution } from '../../hooks/useTransactionExecution';
import { Loading } from '../Loading';

export type KioskListingValue = {
  value: string;
  is_exclusive: boolean;
};

export function KioskItems({
  kioskId,
  kioskOwnerCap,
  address,
}: { address: string } & LocalKioskDataParams): JSX.Element {
  const provider = useRpc();

  const [loading, setLoading] = useState<boolean>(false);

  const [kioskData, setKioskData] = useState<KioskData>({
    items: [],
    listings: [],
    itemIds: [],
    listingIds: [],
  });
  const [modalItem, setModalItem] = useState<OwnedObjectType | null>(null);
  const [kioskItems, setKioskItems] = useState<OwnedObjectType[]>([]);

  const [kioskListings, setKioskListings] =
    useState<Record<string, KioskListingValue>>();

  const { signAndExecute } = useTransactionExecution();

  useEffect(() => {
    if (!kioskId) return;
    getKioskData();
  }, [kioskId]);

  const getKioskData = async () => {
    if (!kioskId) return;
    setLoading(true);

    const { data: res } = await fetchKiosk(
      provider,
      kioskId,
      { limit: 1000 },
      {
        includeItems: true,
        includeListings: true,
      },
    ); // could also add `cursor` for pagination

    setKioskData(res);
    setKioskItems(
      parseObjectDisplays((res.items as SuiObjectResponse[]) || []),
    );
    processKioskListings((res.listings as SuiObjectResponse[]) || []);
    setLoading(false);
  };

  const processKioskListings = (data: SuiObjectResponse[]) => {
    const res = data.map((x) => getObjectFields(x));

    const results: Record<string, KioskListingValue> = {};

    // I don't think we have a type for DynamicField fields (getObjectFields when x is DF)
    res.map((x: any) => {
      results[x?.name?.fields?.id || ''] = {
        value: x?.value || '',
        is_exclusive: !!x?.name.fields?.is_exclusive,
      };
    });
    setKioskListings(results);
  };

  const takeFromKiosk = async (item: OwnedObjectType) => {
    if (!item?.id || !kioskId || !address) return;

    const tx = new TransactionBlock();

    const obj = take(tx, item.type, kioskId, kioskOwnerCap, item.id);

    tx.transferObjects([obj], tx.pure(address));

    const success = await signAndExecute({ tx });
    if (success) getKioskData();
  };

  const delistFromKiosk = async (item: OwnedObjectType) => {
    if (!item?.id || !kioskId || !address) return;
    const tx = new TransactionBlock();

    delist(tx, item.type, kioskId, kioskOwnerCap, item.id);

    const success = await signAndExecute({ tx });

    if (success) getKioskData();
  };

  const listToKiosk = async (item: OwnedObjectType, price: string) => {
    if (!kioskId) return;

    const tx = new TransactionBlock();

    list(tx, item.type, kioskId, kioskOwnerCap, item.id, price);

    await signAndExecute({ tx });

    getKioskData(); // replace with single kiosk Item search here and replace
    setModalItem(null); // replace modal.
  };

  if (loading) return <Loading />;
  return (
    <div className="mt-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {kioskItems.map((item: OwnedObjectType) => (
          <KioskItemCmp
            key={item.id}
            item={item}
            listing={kioskListings && kioskListings[item.id]}
            takeFn={takeFromKiosk}
            listFn={(item: OwnedObjectType) => setModalItem(item)}
            delistFn={(item: OwnedObjectType) => delistFromKiosk(item)}
          />
        ))}
        {modalItem && (
          <ListPrice
            item={modalItem}
            onSubmit={listToKiosk}
            closeModal={() => setModalItem(null)}
          />
        )}
      </div>
    </div>
  );
}
