import { Dispatch, SetStateAction } from "react";
import TextButton from "../../../Components/TextButton";
import { useNavigate } from "react-router-dom";

type FlowNode = {
    id: string;
    position: {x: number; y: number};
    data: {value: string; label: string};
};

export default function TopLeftPanel({nodes, setNodes}: {nodes: FlowNode[], setNodes: Dispatch<SetStateAction<FlowNode[]>>}) {

    const navigate = useNavigate();

    const handleAddClick = async () => {
        const originPath = await window.electron.selectFolder();
        if (!originPath) return;

        const folderName = originPath.split(/[\\/]/).pop() ?? originPath;
        const duplicate = nodes.some((node) => node.id === originPath);

        if (!duplicate) { // Prevent the creation of a duplicate
            setNodes((nodes) => [...nodes, {
                id: originPath,
                position: {x: 0, y: 0},
                data: {value: originPath, label: folderName},
                type: "customNode"
            }]);
        }

        

    }

    return (
        <div className="w-48 h-48 bg-surface-container z-100">
            <TextButton text="Return" clickFunction={() => {navigate("/")}}/>
            <TextButton text="Add Folder" clickFunction={async () => {handleAddClick()}}/>

        </div>
    )

}