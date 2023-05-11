import { SharedObjectRef, SuiObjectRef, TransactionArgument, TransactionBlock } from '@mysten/sui.js';
/**
 * A valid argument for any of the Kiosk functions.
 */
export type ObjectArgument = string | TransactionArgument | SharedObjectRef | SuiObjectRef;
/**
 * Convert any valid input into a TransactionArgument.
 *
 * @param tx The transaction to use for creating the argument.
 * @param arg The argument to convert.
 * @returns The converted TransactionArgument.
 */
export declare function objArg(tx: TransactionBlock, arg: string | SharedObjectRef | SuiObjectRef | TransactionArgument): TransactionArgument;
