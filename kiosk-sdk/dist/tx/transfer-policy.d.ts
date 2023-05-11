import { TransactionArgument, TransactionBlock } from '@mysten/sui.js';
import { ObjectArgument } from '../utils';
/** The Transfer Policy module. */
export declare const TRANSFER_POLICY_MODULE = "0x2::transfer_policy";
/**
 * Call the `transfer_policy::new` function to create a new transfer policy.
 * Returns `transferPolicyCap`
 */
export declare function createTransferPolicy(tx: TransactionBlock, itemType: string, publisher: ObjectArgument): TransactionArgument;
/**
 * Call the `transfer_policy::withdraw` function to withdraw profits from a transfer policy.
 */
export declare function withdrawFromPolicy(tx: TransactionBlock, itemType: string, policy: ObjectArgument, policyCap: ObjectArgument, amount: string | bigint | null): TransactionArgument;
/**
 * Call the `transfer_policy::confirm_request` function to unblock the
 * transaction.
 */
export declare function confirmRequest(tx: TransactionBlock, itemType: string, policy: ObjectArgument, request: TransactionArgument): void;
/**
 * Calls the `transfer_policy::remove_rule` function to remove a Rule from the transfer policy's ruleset.
 */
export declare function removeTransferPolicyRule(tx: TransactionBlock, itemType: string, ruleType: string, configType: string, policy: ObjectArgument, policyCap: TransactionArgument): void;
