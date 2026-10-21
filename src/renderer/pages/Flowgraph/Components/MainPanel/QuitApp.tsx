import { useState } from "react";
import TextButton from "../../../../Components/TextButton";
import Popup from "../../../../Components/Popup";

import quitIcon from "assets/appIcons/exitIcon.png"
import SidebarButton from "./SidebarButton";

export default function QuitApp() {

    const [popup, setPopup] = useState(false);

    const handleQuit = async () => {
        await window.electron.closeApp();
    }

    // <TextButton text="Quit App" wFull={true} clickFunction={() => {setPopup(true)}}/>

    return (
        <>
            <Popup value={popup} setValue={setPopup}>
                <p className="text-on-surface text-center mb-3">Are you sure you want to completely quit the application? All sorting operations will halt.</p>

                <section className="flex justify-center gap-3">
                    <TextButton text="Quit" color=" bg-red-400 " clickFunction={() => {handleQuit()}}/>
                    <TextButton text="Go Back" clickFunction={() => {setPopup(false)}}/>
                </section>

            </Popup>
            
            <SidebarButton text="Quit" image={quitIcon} callback={() => {setPopup(true)}}/>
        </>
    )
}