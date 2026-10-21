import { Dispatch, SetStateAction } from "react";
import TextButton from "../../../Components/TextButton";
import { useNavigate } from "react-router-dom";
import { generateId } from "../../../../main/ipcMainhandleFunctions/ruleId/generateId";
import ClearAllNodes from "./MainPanel/ClearAllNodes";
import { useReactFlow } from "@xyflow/react";
import AddFolder from "./MainPanel/AddFolder";
import QuitApp from "./MainPanel/QuitApp";
import SidebarButton from "./MainPanel/SidebarButton";

import helpIcon from "assets/appIcons/helpIcon.png"
import exitIcon from "assets/appIcons/exitIcon.png"
import hideEditorIcon from "assets/appIcons/hideEditorIcon.png"

export type FlowNode = {
    id: string;
    position: {x: number; y: number};
    data: {value: string; label: string};
};

export default function TopLeftPanel({nodes, setNodes}: {nodes: FlowNode[], setNodes: Dispatch<SetStateAction<FlowNode[]>>}) {

    const navigate = useNavigate();
    const {getEdges} = useReactFlow();

    // <TextButton text="Help" wFull={true} clickFunction={async () => {await window.electron.openExternalUrl("https://github.com/at-tang/Lettertray/wiki")}}/>
    // <TextButton text="Hide Editor" wFull={true} clickFunction={async () => {await window.electron.setToBackground()}}/>
    return (
        <div className="w-20 h-133  bg-surface-container z-100 flex gap-4 items-center justify-left flex-col border-outline-b rounded-2xl border p-6 shadow-lg/30">

            
            
            
            <AddFolder/>
            <ClearAllNodes/>


            <SidebarButton text="Help" callback={async () => {await window.electron.openExternalUrl("https://github.com/at-tang/Lettertray/wiki")}} image={helpIcon}/>
            <SidebarButton text="Hide Editor" callback={async () => {await window.electron.setToBackground()}} image={hideEditorIcon}/>

            <div className="flex-1"/>

            
            
            
            <QuitApp/>
            

        </div>
    )

}