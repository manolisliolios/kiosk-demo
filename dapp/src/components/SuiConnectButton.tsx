// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { ConnectButton, useWalletKit } from "@mysten/wallet-kit";
import { formatAddress } from "@mysten/sui.js";

export function SuiConnectButton() {
    const { currentAccount } = useWalletKit();
    return (
        <ConnectButton
            connectText={"Connect Wallet"}
            connectedText={`Connected: ${formatAddress(currentAccount?.address || '')}`}
        />
    );
}
