import { Dispatch, SetStateAction } from "react";
import TextButton from "../../../Components/TextButton";
import { useNavigate } from "react-router-dom";
import { generateId } from "../../../../main/ipcMainhandleFunctions/ruleId/generateId";
import ClearAllNodes from "./MainPanel/ClearAllNodes";
import { useReactFlow } from "@xyflow/react";
import AddFolder from "./MainPanel/AddFolder";
import QuitApp from "./MainPanel/QuitApp";

export type FlowNode = {
    id: string;
    position: {x: number; y: number};
    data: {value: string; label: string};
};

export default function TopLeftPanel({nodes, setNodes}: {nodes: FlowNode[], setNodes: Dispatch<SetStateAction<FlowNode[]>>}) {

    const navigate = useNavigate();
    const {getEdges} = useReactFlow();

    return (
        <div className="w-48  bg-surface-container z-100 flex gap-3 items-center justify-center flex-col border-outline-b rounded-2xl border p-6 shadow-lg/30">
            
            
            <AddFolder/>
            <ClearAllNodes/>

            <div className="mb-3"/>

            <TextButton text="Help" wFull={true} clickFunction={async () => {await window.electron.openExternalUrl("https://github.com/at-tang/Lettertray/wiki")}}/>
            <TextButton text="Hide Editor" wFull={true} clickFunction={async () => {await window.electron.setToBackground()}}/>
            
            <QuitApp/>
            

        </div>
    )

}