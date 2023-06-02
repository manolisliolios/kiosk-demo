import { FormEvent, ReactElement, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function FindKiosk(): ReactElement {
  const [searchKiosk, setSearchKioskId] = useState<string>('');
  const navigate = useNavigate();

  const { kioskId } = useParams();

  const viewKiosk = (e?: FormEvent<HTMLFormElement>) => {
    if (!searchKiosk || viewingSearchKiosk) return;
    e?.preventDefault();

    navigate('/kiosk/' + searchKiosk);
  };

  const viewingSearchKiosk = searchKiosk === kioskId;
  const isObjectIdInput = (val: string | undefined) =>
    val?.length === 66 || val?.length === 64;

  const onInput = (e: any) => {
    setSearchKioskId(e.target.value);
  };

  return (
    <form onSubmit={viewKiosk} className="text-center lg:min-w-[700px]">
      <div className="flex items-center gap-1 bg-gray-100 border rounded border-gray-300 overflow-hidden">
        <div className="basis-10/12">
          <input
            type="text"
            id="search"
            role="search"
            value={searchKiosk}
            onInput={onInput}
            className="bg-gray-100 border lg:min-w-[600px] text-gray-900 placeholder:text-gray-500 text-sm rounded focus:ring-primary 
            focus:border-primary block w-full p-2.5 outline-primary"
            placeholder="Search for a kiosk..."
            required
          />
        </div>
        <button
          type="submit"
          className="basis-2/12 w-full h-full text-black text-xs mx-auto disabled:opacity-60"
          disabled={kioskId === searchKiosk || !isObjectIdInput(searchKiosk)}
        >
          Visit
        </button>
      </div>
    </form>
  );
}
