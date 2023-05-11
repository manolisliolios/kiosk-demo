import { OwnedObjectType } from "../components/Inventory/OwnedObjects";


export const actionWithLoader = async (fn: (item: OwnedObjectType) => void, item: OwnedObjectType, setLoading: (state: boolean) => void) => {
    setLoading(true);
    await fn(item);
    setLoading(false);
}
