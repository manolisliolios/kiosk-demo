// src/utils.ts
function objArg(tx, arg) {
  if (typeof arg === "string") {
    return tx.object(arg);
  }
  if ("digest" in arg && "version" in arg && "objectId" in arg) {
    return tx.objectRef(arg);
  }
  if ("objectId" in arg && "initialSharedVersion" in arg && "mutable" in arg) {
    return tx.sharedObjectRef(arg);
  }
  if ("kind" in arg) {
    return arg;
  }
  throw new Error("Invalid argument type");
}

// src/tx/kiosk.ts
var KIOSK_MODULE = "0x2::kiosk";
var KIOSK_TYPE = `${KIOSK_MODULE}::Kiosk`;
var KIOSK_OWNER_CAP = `${KIOSK_MODULE}::KioskOwnerCap`;
function createKiosk(tx) {
  let [kiosk, kioskOwnerCap] = tx.moveCall({
    target: `${KIOSK_MODULE}::new`
  });
  return [kiosk, kioskOwnerCap];
}
function createKioskAndShare(tx) {
  let [kiosk, kioskOwnerCap] = tx.moveCall({
    target: `${KIOSK_MODULE}::new`
  });
  tx.moveCall({
    target: `0x2::transfer::public_share_object`,
    typeArguments: [KIOSK_TYPE],
    arguments: [kiosk]
  });
  return kioskOwnerCap;
}
function place(tx, itemType, kiosk, kioskCap, item) {
  tx.moveCall({
    target: `${KIOSK_MODULE}::place`,
    typeArguments: [itemType],
    arguments: [objArg(tx, kiosk), objArg(tx, kioskCap), objArg(tx, item)]
  });
}
function lock(tx, itemType, kiosk, kioskCap, policy, item) {
  tx.moveCall({
    target: `${KIOSK_MODULE}::lock`,
    typeArguments: [itemType],
    arguments: [
      objArg(tx, kiosk),
      objArg(tx, kioskCap),
      objArg(tx, policy),
      objArg(tx, item)
    ]
  });
}
function take(tx, itemType, kiosk, kioskCap, itemId) {
  let [item] = tx.moveCall({
    target: `${KIOSK_MODULE}::take`,
    typeArguments: [itemType],
    arguments: [
      objArg(tx, kiosk),
      objArg(tx, kioskCap),
      tx.pure(itemId, "address")
    ]
  });
  return item;
}
function list(tx, itemType, kiosk, kioskCap, itemId, price) {
  tx.moveCall({
    target: `${KIOSK_MODULE}::list`,
    typeArguments: [itemType],
    arguments: [
      objArg(tx, kiosk),
      objArg(tx, kioskCap),
      tx.pure(itemId, "address"),
      tx.pure(price, "u64")
    ]
  });
}
function delist(tx, itemType, kiosk, kioskCap, itemId) {
  tx.moveCall({
    target: `${KIOSK_MODULE}::delist`,
    typeArguments: [itemType],
    arguments: [
      objArg(tx, kiosk),
      objArg(tx, kioskCap),
      tx.pure(itemId, "address")
    ]
  });
}
function placeAndList(tx, itemType, kiosk, kioskCap, item, price) {
  tx.moveCall({
    target: `${KIOSK_MODULE}::place_and_list`,
    typeArguments: [itemType],
    arguments: [
      objArg(tx, kiosk),
      objArg(tx, kioskCap),
      objArg(tx, item),
      tx.pure(price, "u64")
    ]
  });
}
function purchase(tx, itemType, kiosk, itemId, payment) {
  let [item, transferRequest] = tx.moveCall({
    target: `${KIOSK_MODULE}::purchase`,
    typeArguments: [itemType],
    arguments: [
      objArg(tx, kiosk),
      tx.pure(itemId, "address"),
      objArg(tx, payment)
    ]
  });
  return [item, transferRequest];
}
function withdrawFromKiosk(tx, kiosk, kioskCap, amount) {
  let amountArg = amount !== null ? tx.pure(amount, "Option<u64>") : tx.pure({ None: true }, "Option<u64>");
  let [coin] = tx.moveCall({
    target: `${KIOSK_MODULE}::withdraw`,
    arguments: [objArg(tx, kiosk), objArg(tx, kioskCap), amountArg]
  });
  return coin;
}
function borrow(tx, itemType, kiosk, kioskCap, itemId) {
  let [item] = tx.moveCall({
    target: `${KIOSK_MODULE}::borrow`,
    typeArguments: [itemType],
    arguments: [
      objArg(tx, kiosk),
      objArg(tx, kioskCap),
      tx.pure(itemId, "address")
    ]
  });
  return item;
}
function borrowMut(tx, itemType, kiosk, kioskCap, itemId) {
  let [item] = tx.moveCall({
    target: `${KIOSK_MODULE}::borrow_mut`,
    typeArguments: [itemType],
    arguments: [
      objArg(tx, kiosk),
      objArg(tx, kioskCap),
      tx.pure(itemId, "address")
    ]
  });
  return item;
}
function borrowValue(tx, itemType, kiosk, kioskCap, itemId) {
  let [item, promise] = tx.moveCall({
    target: `${KIOSK_MODULE}::borrow_val`,
    typeArguments: [itemType],
    arguments: [
      objArg(tx, kiosk),
      objArg(tx, kioskCap),
      tx.pure(itemId, "address")
    ]
  });
  return [item, promise];
}
function returnValue(tx, itemType, kiosk, item, promise) {
  tx.moveCall({
    target: `${KIOSK_MODULE}::return_val`,
    typeArguments: [itemType],
    arguments: [objArg(tx, kiosk), item, promise]
  });
}

// src/tx/transfer-policy.ts
var TRANSFER_POLICY_MODULE = "0x2::transfer_policy";
function createTransferPolicy(tx, itemType, publisher) {
  let [transferPolicy, transferPolicyCap] = tx.moveCall({
    target: `${TRANSFER_POLICY_MODULE}::new`,
    typeArguments: [itemType],
    arguments: [objArg(tx, publisher)]
  });
  tx.moveCall({
    target: `0x2::transfer::public_share_object`,
    typeArguments: [itemType],
    arguments: [transferPolicy]
  });
  return transferPolicyCap;
}
function withdrawFromPolicy(tx, itemType, policy, policyCap, amount) {
  let amountArg = amount !== null ? tx.pure(amount, "Option<u64>") : tx.pure({ None: true }, "Option<u64>");
  let [profits] = tx.moveCall({
    target: `${TRANSFER_POLICY_MODULE}::withdraw`,
    typeArguments: [itemType],
    arguments: [
      objArg(tx, policy),
      objArg(tx, policyCap),
      amountArg
    ]
  });
  return profits;
}
function confirmRequest(tx, itemType, policy, request) {
  tx.moveCall({
    target: `${TRANSFER_POLICY_MODULE}::confirm_request`,
    typeArguments: [itemType],
    arguments: [objArg(tx, policy), request]
  });
}
function removeTransferPolicyRule(tx, itemType, ruleType, configType, policy, policyCap) {
  tx.moveCall({
    target: `${TRANSFER_POLICY_MODULE}::remove_rule`,
    typeArguments: [
      itemType,
      ruleType,
      configType
    ],
    arguments: [objArg(tx, policy), policyCap]
  });
}

// src/query/kiosk.ts
async function fetchKiosk(provider, kioskId, pagination) {
  const { data, nextCursor, hasNextPage } = await provider.getDynamicFields({
    parentId: kioskId,
    ...pagination
  });
  const kioskData = data.reduce(
    (acc, val) => {
      const type = val.name.type.split("::").slice(-2).join("::");
      switch (type) {
        case "kiosk::Item":
          acc.itemIds.push(val.objectId);
          acc.items.push({
            itemId: val.objectId,
            itemType: val.objectType,
            bcsName: val.bcsName
          });
          break;
        case "kiosk::Listing":
          acc.listingIds.push(val.objectId);
          acc.listings.push({
            itemId: val.name.value.id,
            listingId: val.objectId,
            isExclusive: val.name.value.is_exclusive,
            bcsName: val.bcsName
          });
          break;
      }
      return acc;
    },
    { listings: [], items: [], itemIds: [], listingIds: [] }
  );
  return {
    data: kioskData,
    nextCursor,
    hasNextPage
  };
}
export {
  KIOSK_MODULE,
  KIOSK_OWNER_CAP,
  KIOSK_TYPE,
  TRANSFER_POLICY_MODULE,
  borrow,
  borrowMut,
  borrowValue,
  confirmRequest,
  createKiosk,
  createKioskAndShare,
  createTransferPolicy,
  delist,
  fetchKiosk,
  list,
  lock,
  objArg,
  place,
  placeAndList,
  purchase,
  removeTransferPolicyRule,
  returnValue,
  take,
  withdrawFromKiosk,
  withdrawFromPolicy
};
//# sourceMappingURL=index.mjs.map