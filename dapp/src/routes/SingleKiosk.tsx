import { useNavigate, useParams } from "react-router-dom"
import { KioskItems } from "../components/Kiosk/KioskItems";
import { useWalletKit } from "@mysten/wallet-kit";

export default function SingleKiosk(): JSX.Element {

    const {kioskId} = useParams();
    const navigate = useNavigate();

    const {currentAccount} = useWalletKit();

    if(!kioskId){
        navigate('/');
        return <></>;
    }
    
    return <div className="container min-h-screen py-12">

        <button onClick={()=>navigate('/')}>Back to home</button>

        <KioskItems kioskId={kioskId} address={currentAccount?.address}></KioskItems>
    </div>
}
