// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useWalletKit } from '@mysten/wallet-kit';
import { Tab } from '@headlessui/react';
import { OwnedObjects } from './Inventory/OwnedObjects';
import { KioskItems } from './Kiosk/KioskItems';

export type KioskData = {
  kioskOwnerCap: string;
  kioskId: string | null;
  setSelectedKiosk?: (address: string | null) => void;
};

export function KioskData({
  kioskOwnerCap,
  kioskId,
  setSelectedKiosk,
}: KioskData) {
  const { currentAccount } = useWalletKit();

  return (
    <div className="container py-12 min-h-[80vh]">
      <button
        onClick={() => setSelectedKiosk && setSelectedKiosk(null)}
        className="mb-6"
      >
        Back to initial view
      </button>

      <div className="mb-12 ">
        <div className="flex gap-5 items-center">
          Selected kiosk
          <input
            defaultValue={kioskId + ''}
            disabled
            className="border p-1 rounded-lg"
          />
        </div>
        <a
          href={`https://suiexplorer.com/object/${kioskId}?network=testnet`}
          target="_blank"
          className="block underline"
        >
          View on explorer
        </a>
      </div>

      <Tab.Group vertical defaultIndex={0}>
        <Tab.List>
          <Tab className="tab-title">My Kiosk</Tab>
          <Tab className="tab-title">My Wallet</Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            {currentAccount && (
              <KioskItems
                kioskId={kioskId}
                kioskOwnerCap={kioskOwnerCap}
                address={currentAccount.address}
              ></KioskItems>
            )}
          </Tab.Panel>
          <Tab.Panel className="mt-12">
            {currentAccount && (
              <OwnedObjects
                kioskId={kioskId}
                kioskOwnerCap={kioskOwnerCap}
                address={currentAccount.address}
              ></OwnedObjects>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
