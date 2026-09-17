import { addEdge, Connection, Edge, MarkerType, useReactFlow } from "@xyflow/react";
import SetRegex from "../../../Components/SetRegex";
import { useEffect, useState } from "react";
import SubmitRuleButton from "../../../Components/SubmitRule";
import { Rule } from "../../../../main/api/types";
import saveNodes from "../Custom/Component/Functions/saveNodes";
import downArrowImg from '../../../../../assets/appIcons/down_arrow.png'
import folderImg from '../../../../../assets/appIcons/folder.png'

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

    const [type, setType] = useState("CONTAINS");
    const [directoriesAllowed, setDirectoriesAllowed] = useState(false);
    const [caseSensitive, setCaseSensitive] = useState(false);



    useEffect(() => {
        console.log(keyword);
        console.log(viewKeyword);

    }, [keyword, viewKeyword])

    return (
        <div className="min-w-[800px] max-w-[1000px]">
            <section className="flex-col flex gap-6">
                <div className="flex justify-center gap-3 items-center">
                    <img src={folderImg} alt="Folder Icon" className="w-6 h-6 invert"/>
                    <p>{oldDir}</p>
                </div>

                <div className="flex justify-center">
                    <img src={downArrowImg} alt="To" className="w-6 h-6"/>
                </div>

                <div className="flex justify-center gap-3 items-center">
                    <img src={folderImg} alt="Folder Icon" className="w-6 h-6 invert"/>
                    <p>{newDir}</p>
                </div>

                <hr className="mt-2 mb-3"/>
            </section>



            <SetRegex 
            value={keyword} 
            setValue={setKeyword} 
            value2={viewKeyword} 
            setValue2={setViewKeyword}
            type={type}
            setType={setType}
            directoriesAllowed={directoriesAllowed}
            setDirectoriesAllowed={setDirectoriesAllowed}
            
            
            
            />

            <div className="flex-1 flex justify-center mb-6 mt-4">
                <p className="">{`If files in`} 
                    <span className="inline items-center ml-2 mr-1"><img src={folderImg} alt="Folder icon" className="invert w-4 h-4 inline"/></span>
                    
                    
                    {`${oldDir.split(/[/\\]/).at(-1)} `} 

                    <b className="text-primary-container">
                            {(type === "START" ? `starts with ` : 
                            type === "END" ? `ends with ` : 
                            type === "CONTAINS" ? `contains ` :
                            type === "EXTENSION" ? `has extension .` :
                            `contains `
                        )}
                    </b>
                "{viewKeyword}", place that file in 
                <span className="inline items-center ml-2 mr-1"><img src={folderImg} alt="Folder icon" className="invert w-4 h-4 inline"/></span>
                {`${newDir.split(/[/\\]/).at(-1)} `} 
                
                </p>
                        
            </div>                   



            



            <SubmitRuleButton 
            oldDir={oldDir} 
            newDir={newDir} 
            regex={keyword} 
            viewKeyword={viewKeyword}
            type={type}
            caseSensitive={caseSensitive}
            directoriesAllowed={directoriesAllowed}
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
        </div>

    )
}