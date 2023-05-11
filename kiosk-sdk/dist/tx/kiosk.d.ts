import { SuiAddress, TransactionArgument, TransactionBlock } from '@mysten/sui.js';
import { ObjectArgument } from '../utils';
/** The Kiosk module. */
export declare const KIOSK_MODULE = "0x2::kiosk";
/** The Kiosk type. */
export declare const KIOSK_TYPE: string;
/** The Kiosk Owner Cap Type */
export declare const KIOSK_OWNER_CAP: string;
/**
 * Create a new shared Kiosk and returns the [kiosk, kioskOwnerCap] tuple.
 */
export declare function createKiosk(tx: TransactionBlock): [TransactionArgument, TransactionArgument];
/**
 * Calls the `kiosk::new()` function and shares the kiosk.
 * Returns the `kioskOwnerCap` object.
 */
export declare function createKioskAndShare(tx: TransactionBlock): TransactionArgument;
/**
 * Call the `kiosk::place<T>(Kiosk, KioskOwnerCap, Item)` function.
 * Place an item to the Kiosk.
 */
export declare function place(tx: TransactionBlock, itemType: string, kiosk: ObjectArgument, kioskCap: ObjectArgument, item: ObjectArgument): void;
/**
 * Call the `kiosk::lock<T>(Kiosk, KioskOwnerCap, TransferPolicy, Item)`
 * function. Lock an item in the Kiosk.
 *
 * Unlike `place` this function requires a `TransferPolicy` to exist
 * and be passed in. This is done to make sure the item does not get
 * locked without an option to take it out.
 */
export declare function lock(tx: TransactionBlock, itemType: string, kiosk: ObjectArgument, kioskCap: ObjectArgument, policy: ObjectArgument, item: ObjectArgument): void;
/**
 * Call the `kiosk::take<T>(Kiosk, KioskOwnerCap, ID)` function.
 * Take an item from the Kiosk.
 */
export declare function take(tx: TransactionBlock, itemType: string, kiosk: ObjectArgument, kioskCap: ObjectArgument, itemId: SuiAddress): TransactionArgument;
/**
 * Call the `kiosk::list<T>(Kiosk, KioskOwnerCap, ID, u64)` function.
 * List an item for sale.
 */
export declare function list(tx: TransactionBlock, itemType: string, kiosk: ObjectArgument, kioskCap: ObjectArgument, itemId: SuiAddress, price: string | bigint): void;
/**
 * Call the `kiosk::list<T>(Kiosk, KioskOwnerCap, ID, u64)` function.
 * List an item for sale.
 */
export declare function delist(tx: TransactionBlock, itemType: string, kiosk: ObjectArgument, kioskCap: ObjectArgument, itemId: SuiAddress): void;
/**
 * Call the `kiosk::place_and_list<T>(Kiosk, KioskOwnerCap, Item, u64)` function.
 * Place an item to the Kiosk and list it for sale.
 */
export declare function placeAndList(tx: TransactionBlock, itemType: string, kiosk: ObjectArgument, kioskCap: ObjectArgument, item: ObjectArgument, price: string | bigint): void;
/**
 * Call the `kiosk::purchase<T>(Kiosk, ID, Coin<SUI>)` function and receive an Item and
 * a TransferRequest which needs to be dealt with (via a matching TransferPolicy).
 */
export declare function purchase(tx: TransactionBlock, itemType: string, kiosk: ObjectArgument, itemId: SuiAddress, payment: ObjectArgument): [TransactionArgument, TransactionArgument];
/**
 * Call the `kiosk::withdraw(Kiosk, KioskOwnerCap, Option<u64>)` function and receive a Coin<SUI>.
 * If the amount is null, then the entire balance will be withdrawn.
 */
export declare function withdrawFromKiosk(tx: TransactionBlock, kiosk: ObjectArgument, kioskCap: ObjectArgument, amount: string | bigint | null): TransactionArgument;
/**
 * Call the `kiosk::borrow<T>(Kiosk, KioskOwnerCap, ID): &T` function.
 * Immutably borrow an item from the Kiosk.
 */
export declare function borrow(tx: TransactionBlock, itemType: string, kiosk: ObjectArgument, kioskCap: ObjectArgument, itemId: SuiAddress): TransactionArgument;
/**
 * Call the `kiosk::borrow_mut<T>(Kiosk, KioskOwnerCap, ID): &mut T` function.
 * Mutably borrow an item from the Kiosk.
 */
export declare function borrowMut(tx: TransactionBlock, itemType: string, kiosk: ObjectArgument, kioskCap: ObjectArgument, itemId: SuiAddress): TransactionArgument;
/**
 * Call the `kiosk::borrow_value<T>(Kiosk, KioskOwnerCap, ID): T` function.
 * Immutably borrow an item from the Kiosk and return it in the end.
 *
 * Requires calling `returnValue` to return the item.
 */
export declare function borrowValue(tx: TransactionBlock, itemType: string, kiosk: ObjectArgument, kioskCap: ObjectArgument, itemId: SuiAddress): [TransactionArgument, TransactionArgument];
/**
 * Call the `kiosk::return_value<T>(Kiosk, Item, Borrow)` function.
 * Return an item to the Kiosk after it was `borrowValue`-d.
 */
export declare function returnValue(tx: TransactionBlock, itemType: string, kiosk: ObjectArgument, item: TransactionArgument, promise: TransactionArgument): void;
