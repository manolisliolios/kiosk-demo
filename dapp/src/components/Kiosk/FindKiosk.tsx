import { FormEvent, ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { localStorageKeys } from "../../utils/utils";

export default function FindKiosk(): ReactElement {


    const [searchKiosk, setSearchKioskId] = useState<string>(localStorage.getItem(localStorageKeys.LAST_VISITED_KIOSK_ID) || '');
    const navigate = useNavigate();

    const viewKiosk = (e: FormEvent<HTMLFormElement>) => {
        if (!searchKiosk) return;
        e.preventDefault();
        navigate('/kiosk/' + searchKiosk);
    }

    const onInput = (e) => {

        localStorage.setItem(localStorageKeys.LAST_VISITED_KIOSK_ID, e.target.value);
        setSearchKioskId(e.target.value)
    }

    return <form onSubmit={viewKiosk} className="text-center mb-12 min-w-[700px]">
        <h2 className="text-lg font-bold mb-6">Visit a kiosk...</h2>
        <div className="flex items-end gap-5">
            <div className="basis-9/12">
                <input type="text" id="search"
                role="search"
                    value={searchKiosk} onInput={onInput}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary 
            focus:border-primary block w-full p-2.5 outline-primary"
                    placeholder="0x......" required />
            </div>
            <button type="submit" className="bg-primary text-white">Visit</button>
        </div>



    </form>

} 
