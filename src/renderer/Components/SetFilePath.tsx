import { Dispatch, SetStateAction } from "react";
import TextButton from "./TextButton";

export default function SetFilePath({value, setValue}: {value: string, setValue: Dispatch<SetStateAction<string>>}) {
    const handlePathChange = async () => {
        const selectedPath = await window.electron.selectFolder();
        setValue(selectedPath);
    }

    return (

        <div className="flex items-center h-7">

            <button 
            onClick={() => {handlePathChange()}}
            className="bg-surface-container-h rounded-l-2xl h-full px-4 py-1 hover:cursor-pointer hover:brightness-75 transition ease-in-out flex items-center">Change</button>
            <div className=" flex-1 h-full bg-on-surface overflow-x-scroll scrollbar-none text-surface pl-4 rounded-r-2xl flex items-center">{value}</div>
        </div>
    )
}