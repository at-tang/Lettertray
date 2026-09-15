import { Handle, Position } from "@xyflow/react";
import folderImage from '../../../../../assets/appIcons/folder.png'
import { useState } from "react";

export default function CustomNode({data}) {

    const [displayValue, setDisplayValue] = useState(data.value)

    const handleChangeData = async () => {
        /*
        This function allows users to change the folder that this particular node
        represents. This will either set a new folder to watch, and organize all files
        in said folder to the old folder's rules.

        Returns void.
        */
        const newPath: string = await window.electron.selectFolder();

        // Prevents anything from happening if the user exits from the "Select Folder" menu
        if (newPath !== null && newPath !== undefined && newPath !== "") {
            const success: boolean = await window.electron.handleNodeChangeData(data.value, newPath);
            if (success) {
                data.value = newPath; 
                setDisplayValue(newPath);
            }
        }
    }


    return (
        <div 

        className="bg-surface-container-h text-on-surface px-10 py-3 rounded-2xl hover:cursor-move">
            <div className="flex gap-2 items-center">
                <button className="hover:cursor-pointer hover:scale-115 transition ease-in-out" onClick={() => {handleChangeData()}}>
                    <img src={folderImage} alt="Folder Icon" width={24} height={24} className="invert w-7 h-7"/>
                </button>

                <p className="text-lg">{displayValue}</p>
                
                
            </div>


            <Handle type="target" position={Position.Left} className="w-6! h-6! bg-blue-500!" />

            <Handle type="source" position={Position.Right} className="w-0! h-0! border-y-[10px]! border-y-transparent! border-x-transparent! border-l-[20px]! border-l-yellow-500! bg-transparent! rounded-none!" />

        </div>
    )
}