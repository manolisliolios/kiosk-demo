// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { WalletKitProvider } from '@mysten/wallet-kit';
import { Header } from './components/Base/Header';

export default function Root() {
  return (
    <WalletKitProvider enableUnsafeBurner={import.meta.env.DEV}>
      <Header></Header>
      <div className="min-h-[80vh]">
        <Outlet />
      </div>
      <div className="mt-6 border-t border-primary text-center py-6">
        Copyright © 2023 by Mysten Labs
      </div>
      <Toaster position="bottom-center" />
    </WalletKitProvider>
  );
}
