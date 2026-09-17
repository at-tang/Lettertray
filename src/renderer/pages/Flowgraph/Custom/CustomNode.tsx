import { Handle, Position, useReactFlow } from "@xyflow/react";
import folderImage from '../../../../../assets/appIcons/folder.png'
import { useContext, useEffect, useState } from "react";
import saveNodes from "./Component/Functions/saveNodes";
import DeleteNodeButton from "./Component/Node/DeleteNodeButton";
import { FlowgraphContext } from "../Flowgraph";

export default function CustomNode({id, data}) {

    const [displayValue, setDisplayValue] = useState(data.label)
    const { updateNodeData, setEdges, getNodes, getEdges } = useReactFlow();
    const [showFull, setShowFull] = useState(false)

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
                const label = newPath.split(/[\\/]/).pop() ?? newPath;
                console.log("Id: " + id);
                // Issue here, updatingNodes does not reflect immediately. 
                await updateNodeData(id, {value: newPath, label});
                console.log("HandleChangeData Nodes: " + JSON.stringify(getNodes()));

                setDisplayValue(newPath);
                await saveNodes(getNodes(), getEdges(), setEdges)

            }
        }
    }
    
    // Saves the flowgraph whenever the data is changed. Connected to handleChangeData.
    useEffect(() => {
        const saveFlowgraph = async () => {
            await saveNodes(getNodes(), getEdges(), setEdges);
        }
        saveFlowgraph();
    }, [data])

    const {connecting} = useContext(FlowgraphContext);



    return (


            <div 
            onDragStart={() => {console.log("Drag begin!"); setShowFull(true)}}
            onDragEnd={() => {
                console.log("Drag ended!")
                setShowFull(false)
                saveNodes(getNodes(), getEdges(), setEdges)
            }}
            className="bg-surface-container-h border-outline-b border-4 text-on-surface px-10 py-3 rounded-2xl hover:cursor-move">
                <div className="flex gap-3 items-center">
                    <button className="hover:cursor-pointer hover:scale-115 transition ease-in-out" onClick={() => {handleChangeData()}}>
                        <img src={folderImage} alt="Folder Icon" width={24} height={24} className="invert w-7 h-7"/>
                    </button>

                    <p className="text-lg">{data.label}</p>

                    <DeleteNodeButton id={id}/>
                    
                    
                </div>

                

                <Handle type="target" position={Position.Left} className={"w-9! h-9! z-10 bg-primary-container! border-0! hover:scale-120! transition! "} >
                    <div className={"w-9! h-9! bg-primary-container! rounded-full! border-0! hover:scale-120! transition! " + (connecting ? " animate-ping! origin-center!  -absolute!  " : " ")}/>

                </Handle>

                

                <Handle type="source" position={Position.Right} className="w-0! h-0! border-y-[15px]! border-y-transparent! border-x-transparent! border-l-[30px]! border-l-yellow-400! bg-transparent! rounded-none! hover:scale-120! transition!" />

            </div>


    )
}