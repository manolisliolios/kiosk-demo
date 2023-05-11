// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { KioskData } from "../KioskData";
import { OwnedObjectType } from "./OwnedObjects";
import { DisplayObject } from "../DisplayObject";


export function OwnedObject({ object, placeFn, listFn }: KioskData & { listFn: (item: OwnedObjectType) => void, placeFn: (item: OwnedObjectType) => void; object: OwnedObjectType }): JSX.Element {


    return (
        <DisplayObject item={object}>
            <>
                <button onClick={()=>placeFn(object)}>Place in kiosk</button>
                <button onClick={()=>listFn(object)} className="btn-outline-primary">List in Kiosk</button>
            </>
        </DisplayObject>
    )
}
