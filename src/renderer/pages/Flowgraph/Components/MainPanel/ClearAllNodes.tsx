import { useState } from "react";
import Popup from "../../../../Components/Popup";
import TextButton from "../../../../Components/TextButton";
import { useNavigate } from "react-router-dom";
import SidebarButton from "./SidebarButton";
import icon from "assets/appIcons/clearIcon.png"

export default function ClearAllNodes() {

    const [popup, setPopup] = useState(false);
    const navigate = useNavigate();
    // <TextButton wFull={true} color="bg-red-400" text="Clear All" clickFunction={() => {setPopup(true)}}/>
    return (
        <>
            
            <SidebarButton text="Clear" callback={() => {setPopup(true)}} image={icon}/>

            <Popup value={popup} setValue={setPopup}>
                <p className="text-center text-on-surface mb-4">Are you sure you want to clear everything? This action is not reversible.</p>
                <div className="flex justify-center gap-3">
                    <TextButton color=" bg-red-400 " text="Confirm" clickFunction={async () => {
                        await window.electron.clearAllRules();
                        window.location.reload();



                    }}/>

                    <TextButton text="Go Back" clickFunction={() => {setPopup(false)}}/>
                </div>
            </Popup>
        </>
    )
}