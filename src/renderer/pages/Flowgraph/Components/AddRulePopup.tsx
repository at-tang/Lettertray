import { addEdge, Connection, Edge, MarkerType, useReactFlow } from "@xyflow/react";
import SetRegex from "../../../Components/SetRegex";
import { useEffect, useState } from "react";
import SubmitRuleButton from "../../../Components/SubmitRule";
import { Rule } from "../../../../main/api/types";
import saveNodes from "../Custom/Component/Functions/saveNodes";

export default function AddRulePopup(
    {oldDir, newDir, connection, setEdges, setPopupStatus, nodes, edges}: 
    {oldDir: string, 
        newDir: string, 
        connection: Connection, 
        setEdges: React.Dispatch<React.SetStateAction<Edge[]>>, 
        setPopupStatus: React.Dispatch<React.SetStateAction<boolean>>,
        nodes: Node[],
        edges: Edge[]
    }) {

    const [keyword, setKeyword] = useState("");
    const [viewKeyword, setViewKeyword] = useState("");


    useEffect(() => {
        console.log(keyword);
        console.log(viewKeyword);

    }, [keyword, viewKeyword])

    return (
        <>
            <p>Old Dir: {oldDir}</p>
            <p>New Dir: {newDir}</p>
            <SetRegex value={keyword} setValue={setKeyword} value2={viewKeyword} setValue2={setViewKeyword}/>

            <SubmitRuleButton 
            oldDir={oldDir} 
            newDir={newDir} 
            regex={keyword} 
            viewKeyword={viewKeyword}
            callback={async (newRule: Rule) => { // Get the rule created by SubmitRule

                const newEdge: Edge = {
                    id: `__${connection.source}~${connection.target}`,
                    source: connection.source,
                    target: connection.target,
                    sourceHandle: connection.sourceHandle,
                    targetHandle: connection.targetHandle,
                    type: 'customEdge',
                    data: {value: newRule},
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                    },
                    
                }
            
                setEdges((oldEdges) => addEdge(newEdge, oldEdges)); // Add edge
                console.log("Edges: " + JSON.stringify(edges))

                setPopupStatus(false); // Close this popup
                
            }}
            
            />
        </>

    )
}