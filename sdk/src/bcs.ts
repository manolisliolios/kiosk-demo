// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { bcs } from '@mysten/sui.js';

/**
 * The Kiosk object fields (for BCS queries).
 */
export type Kiosk = {
    id: string;
    profits: string;
    owner: string;
    itemCount: number;
    allowExtensions: boolean;
};

// Register the `Kiosk` struct for faster queries.
bcs.registerStructType('Kiosk', {
    id: 'address',
    profits: 'u64',
    owner: 'address',
    itemCount: 'u32',
    allowExtensions: 'bool'
});

/**
 * PurchaseCap object fields (for BCS queries).
 */
export type PurchaseCap = {
    id: string;
    kioskId: string;
    itemId: string;
    minPrice: string;
};

// Register the `PurchaseCap` for faster queries.
bcs.registerStructType('PurchaseCap', {
    id: 'address',
    kioskId: 'address',
    itemId: 'address',
    minPrice: 'u64'
});

export { bcs };
