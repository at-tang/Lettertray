import { useState } from "react";
import { HistoryEntry } from "../../../../main/classes/History";
import TextButton from "../../../Components/TextButton";
import Popup from "../../../Components/Popup";
import folderImg from '../../../../../assets/appIcons/folder.png'

export default function HistoryEntry(
    {
    originDir,
    newDir,
    fileName,
    time, 
    extraClasses}: 
    {originDir: string,
    newDir: string,
    fileName: string,
    time: number
     extraClasses: string
    
    }) {
    const newDirName = newDir.split(/[/\\]/).at(-1);
    const date = new Date(time);
    const [errorPopup, setErrorPopup] = useState(false);

    const handleOpenFolder = async () => {
        const canOpenFolder: boolean = await window.electron.openFolder(newDir)
        if (!canOpenFolder) { // If the folder cannot be found, create an error popup
            setErrorPopup(true)

        }
    }
    return (
        <div className={` ${extraClasses} flex gap-3 py-2 px-3 items-center`}>
            <Popup value={errorPopup} setValue={setErrorPopup}>
                <p>Could not find folder: "{newDir}"</p>
            </Popup>

            <p><span className=" text-primary font-extrabold">"{fileName}" {" "}</span> was moved to <span className="flex gap-1 items-center"><img src={folderImg} alt="Folder Icon" className="w-4 h-4 invert"/>{newDirName}</span> -- {date.toDateString()}, {date.getHours()}:{date.getMinutes()}</p>
            <div className="flex-1"></div>
            <TextButton text="Open File" clickFunction={() => {handleOpenFolder()}}/>
            


        </div>


    )
}