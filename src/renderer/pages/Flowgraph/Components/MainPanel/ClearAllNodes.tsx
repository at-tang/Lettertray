import { useState } from "react";
import Popup from "../../../../Components/Popup";
import TextButton from "../../../../Components/TextButton";
import { useNavigate } from "react-router-dom";

export default function ClearAllNodes() {

    const [popup, setPopup] = useState(false);
    const navigate = useNavigate();
    return (
        <>
            <TextButton wFull={true} color="bg-red-400" text="Clear All" clickFunction={() => {setPopup(true)}}/>

            <Popup value={popup} setValue={setPopup}>
                <p className="text-center text-on-surface mb-4">Are you sure you want to clear everything? This action is not reversible.</p>
                <div className="flex justify-center">
                    <TextButton color=" bg-red-400 " text="Confirm" clickFunction={async () => {
                        await window.electron.clearAllRules();
                        window.location.reload();



                    }}/>
                </div>
            </Popup>
        </>
    )
}