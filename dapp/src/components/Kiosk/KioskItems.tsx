// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { KioskListing, delist, fetchKiosk, list, place, purchaseAndResolvePolicies, queryTransferPolicy, take } from '@mysten/kiosk';
import { KioskData as LocalKioskDataParams } from '../KioskData';
import { useRpc } from '../../hooks/useRpc';
import { useEffect, useMemo, useState } from 'react';
import { KioskItem as KioskItemCmp } from './KioskItem';
import {
  SuiObjectResponse,
  TransactionBlock,
} from '@mysten/sui.js';
import { ListPrice } from '../Modals/ListPrice';
import { OwnedObjectType } from '../Inventory/OwnedObjects';
import { getOwnedKiosk, getOwnedKioskCap, parseObjectDisplays } from '../../utils/utils';
import { useTransactionExecution } from '../../hooks/useTransactionExecution';
import { Loading } from '../Loading';
import { toast } from 'react-hot-toast';
import { useWalletKit } from '@mysten/wallet-kit';
import { useLocation } from 'react-router-dom';

export function KioskItems({
  kioskId,
  address,
}: { address?: string } & LocalKioskDataParams): JSX.Element {
  const provider = useRpc();
  const [loading, setLoading] = useState<boolean>(false);
  const {currentAccount} = useWalletKit();
  const location = useLocation();

  const isKioskPage = location.pathname.startsWith('/kiosk/')

  // we are depending on currentAccount too, as this is what triggers the `getOwnedKioskCap()` function to change
  const kioskOwnerCap = useMemo(() => { 
    return getOwnedKioskCap();
  }, [currentAccount?.address]);

  // checks if this is an owned kiosk.
  // We are depending on currentAccount too, as this is what triggers the `getOwnedKioskCap()` function to change
  const isOwnedKiosk = useMemo(() => {
    return getOwnedKiosk() === (kioskId?.startsWith('0x') ? kioskId: `0x${kioskId}`);
  }, [kioskId, currentAccount?.address]);

  const [modalItem, setModalItem] = useState<OwnedObjectType | null>(null);
  const [kioskItems, setKioskItems] = useState<OwnedObjectType[]>([]);

  const [kioskListings, setKioskListings] =
    useState<Record<string, KioskListing>>();

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
        includeKioskFields: true,
        includeItems: true,
        withListingPrices: true,
      },
    ); // could also add `cursor` for pagination

    setKioskItems(
      parseObjectDisplays((res.items as SuiObjectResponse[]) || []),
    );
    processKioskListings((res.listings as KioskListing[]) || []);
    setLoading(false);
  };

  const processKioskListings = (data: KioskListing[]) => {

    const results: Record<string, KioskListing> = {};

    data.map((x: KioskListing) => {
      results[x.itemId || ''] = x
    });
    setKioskListings(results);
  };

  const takeFromKiosk = async (item: OwnedObjectType) => {
    if (!item?.id || !kioskId || !address || !kioskOwnerCap) return;

    const tx = new TransactionBlock();

    const obj = take(tx, item.type, kioskId, kioskOwnerCap, item.id);

    tx.transferObjects([obj], tx.pure(address));

    const success = await signAndExecute({ tx });
    if (success) getKioskData();
  };

  const delistFromKiosk = async (item: OwnedObjectType) => {
    if (!item?.id || !kioskId || !address || !kioskOwnerCap) return;
    const tx = new TransactionBlock();

    delist(tx, item.type, kioskId, kioskOwnerCap, item.id);

    const success = await signAndExecute({ tx });

    if (success) getKioskData();
  };

  const listToKiosk = async (item: OwnedObjectType, price: string) => {
    if (!kioskId || !kioskOwnerCap) return;

    const tx = new TransactionBlock();

    list(tx, item.type, kioskId, kioskOwnerCap, item.id, price);

    await signAndExecute({ tx });

    getKioskData(); // replace with single kiosk Item search here and replace
    setModalItem(null); // replace modal.
  };

  const purchaseItem = async (item: OwnedObjectType) => {

    const ownedKiosk = getOwnedKiosk();
    const ownedKioskCap = getOwnedKioskCap();

    if(!item || !item.listing || !kioskId || !address || !ownedKiosk || !ownedKioskCap) return;

    const policy = await queryTransferPolicy(provider, item.type);

    const policyId = policy[0]?.id;
    if(!policyId)
      return toast.error(`This item doesn't have a Transfer Policy attached so it can't be traded through kiosk.`);
    
    const tx = new TransactionBlock();

    const purchasedItem = purchaseAndResolvePolicies(tx, item.type, item.listing, kioskId, item.id, policy[0]);

    if(!purchasedItem) return; // cancel if we don't have an item returned.

    place(tx, item.type, ownedKiosk, ownedKioskCap , purchasedItem);

    await signAndExecute({tx});

    getKioskData();
  }

  if (loading) return <Loading />;
  return (
    <div className="mt-12">
        {
          // We're hiding this when we've clicked "view kiosk" for our own kiosk.
          isOwnedKiosk && isKioskPage && 
          <div className="bg-yellow-300 text-black rounded-lg px-3 py-2 mb-6">
            You're viewing your own kiosk
            </div>
        }
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
    
        {kioskItems.map((item: OwnedObjectType) => (
          <KioskItemCmp
            key={item.id}
            item={item}
            isGuest={!isOwnedKiosk}
            listing={kioskListings && kioskListings[item.id]}
            takeFn={takeFromKiosk}
            listFn={(item: OwnedObjectType) => setModalItem(item)}
            delistFn={(item: OwnedObjectType) => delistFromKiosk(item)}
            purchaseFn={purchaseItem}
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
