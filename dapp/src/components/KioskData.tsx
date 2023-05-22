// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useWalletKit } from '@mysten/wallet-kit';
import { Tab } from '@headlessui/react';
import { OwnedObjects } from './Inventory/OwnedObjects';
import { KioskItems } from './Kiosk/KioskItems';
import { Kiosk, getKioskObject } from '@mysten/kiosk';
import { useEffect, useState } from 'react';
import { useRpc } from '../hooks/useRpc';
import { formatAddress } from '@mysten/sui.js';
import { ExplorerLink } from './ExplorerLink';

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
  const provider = useRpc();
  const { currentAccount } = useWalletKit();
  const [kiosk, setKiosk] = useState<Kiosk | undefined>(undefined);

  useEffect(() => {
    if (!kiosk && kioskId) {
      getKioskObject(provider, kioskId).then((res) => setKiosk(res));
    }
  }, [kioskId]);

  return (
    <div className="container py-12 min-h-[80vh]">
      <button
        onClick={() => setSelectedKiosk && setSelectedKiosk(null)}
        className="mb-6"
      >
        Back to initial view
      </button>

      <div className="mb-12 ">
        {kiosk && (
          <div className="gap-5 items-center">
            <div>
              Selected Kiosk:{' '}
              {
                <ExplorerLink
                  text={formatAddress(kiosk.id)}
                  object={kiosk.id}
                />
              }
            </div>
            <div className="mt-2">
              Owner (displayed): (
              <ExplorerLink
                text={formatAddress(kiosk.owner)}
                address={kiosk.owner}
              />
              )
            </div>
            <div className="mt-2">Items Count: {kiosk.itemCount}</div>
            <div className="mt-2">Profits: {kiosk.profits} MIST</div>
            <div className="mt-2">
              UID Exposed: {kiosk.allowExtensions.toString()}{' '}
            </div>
          </div>
        )}
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
