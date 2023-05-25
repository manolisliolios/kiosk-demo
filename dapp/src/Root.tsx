// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { WalletKitProvider } from '@mysten/wallet-kit';

export default function Root() {
    return (
        <WalletKitProvider enableUnsafeBurner={import.meta.env.DEV}>
            <Outlet />
            <Toaster position="bottom-center" />
        </WalletKitProvider>
    );
}
