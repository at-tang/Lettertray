import { Handle, Position } from "@xyflow/react";
import folderImage from '../../../../../assets/appIcons/folder.png'

export default function CustomNode({data}) {
    return (
        <div className="bg-surface-container-h text-on-surface px-10 py-3 rounded-2xl hover:cursor-move">
            <div className="flex gap-2 items-center">
                <button className="hover:cursor-pointer hover:scale-115 transition ease-in-out">
                    <img src={folderImage} alt="Folder Icon" width={24} height={24} className="invert w-5 h-5"/>

                </button>
                
                {data.value}
            </div>


            <Handle type="target" position={Position.Left} className="w-6! h-6! bg-blue-500!" />

            <Handle type="source" position={Position.Right} className="w-0! h-0! border-y-[10px]! border-y-transparent! border-x-transparent! border-l-[20px]! border-l-yellow-500! bg-transparent! rounded-none!" />

        </div>
    )
}