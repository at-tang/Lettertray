import { useNavigate } from "react-router-dom"
import TextButton from "../../Components/TextButton";
import { addEdge, applyEdgeChanges, applyNodeChanges, Background, Connection, Controls, Edge, EdgeChange, Node, NodeChange, Panel, ReactFlow, useReactFlow } from "@xyflow/react";
import { createContext, useCallback, useEffect, useState } from "react";
import { AutomationRequest, AutomatorNode, Data, Position } from "../../../main/api/types";
import '@xyflow/react/dist/style.css';
import TopLeftPanel from "./Components/TopLeftPanel";
import Popup from "../../Components/Popup";
import AddRulePopup from "./Components/AddRulePopup";
import { CustomEdge } from "./Custom/CustomEdge";
import CustomNode from "./Custom/CustomNode";
import AddRules, { Keyword } from "../../Components/AddRules/AddRules";

export const FlowgraphContext = createContext();
export default function Flowgraph() {
    const navigate = useNavigate();

    const [addPopup, setAddPopup] = useState(false); // Controls if the popup for adding a new rule appears

    type FlowNode = Node<{value: string; label: string}>;

    const [nodes, setNodes] = useState<FlowNode[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    const nodeTypes = { customNode: CustomNode }
    const edgeTypes = { customEdge: CustomEdge }

    const [initialLoadDone, setInitialLoadDone] = useState(false);

    const [dragging, setDragging] = useState(false); // Is the user currently dragging a node?
    const [connecting, setConnecting] = useState(false);

    const [editing, setEditing] = useState(false); // Configures the Add Rule Popup to either edit or add an edge
    const [editTemplate, setEditTemplate] = useState<Keyword[]>([new Keyword()]);

    useEffect(() => {
        console.log(`editTemplate:`)
        console.log(editTemplate)
    }, [editTemplate])
    


    useEffect(() => {
        const saveFlowgraph = async () => {
            const flowgraph = {nodes: nodes, edges: edges
            }
            await window.electron.saveFlowgraph(flowgraph); 
        }
        if (initialLoadDone) saveFlowgraph(); // Done to make sure saved flowgraph is not overwritten
        console.log(edges)     
    }, [edges])


    const onNodeDragStop = async () => {
        setDragging(false)
        window.electron.saveFlowgraph({nodes: nodes, edges: edges});
    }

    


    // Retrieves all the user's data from storage to construct the flowgraph
    useEffect(() => {
        const loadFlowgraph = async () => {
            const flowgraph = await window.electron.loadFlowgraph();
            setNodes(flowgraph.nodes)
            setEdges(flowgraph.edges);
            setInitialLoadDone(true);
        }
        loadFlowgraph();


    }, [])


    // Updates the state arrays nodes/edges whenever a change is detected
    const onNodesChange = useCallback((changes: NodeChange<FlowNode>[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)), [], )
    const onEdgesChange = useCallback((changes: EdgeChange<Edge>[]) => {
        // Edges may receive multiple duplicate saves
        setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot))
        console.log("Edges: " + edges)
        window.electron.saveFlowgraph({nodes: nodes, edges: edges})
    }
        , [],);



    // When establishing new connections (connecting one node to another), open the "Add Rule" popup
    const [oldDir, setOldDir] = useState(""); // Used to determine where to create the edge and what it connects
    const [newDir, setNewDir] = useState("");
    const [currConnection, setCurrConnection] = useState<Connection>();
    const onConnect = useCallback(
        (connection: Connection) => {

            // Currently, edges with the same source and connection are not permitted
            // This may change in the future
            if (edges.some((edge) => {return edge.source === connection.source && edge.target === connection.target}) === true) {
                let newEdges = [...edges]
                console.log(newEdges.filter((edge) => {return edge.source === connection.source && edge.target === connection.target}));
                console.log("Edge Source: " + connection.source)
                console.log("Edge Target: " + connection.target)
                return;
            } else {

                setEditing(false)
                setEditTemplate([new Keyword()])

                const originDirectory = nodes.find((node) => {return node.id == connection.source})?.data.value;
                const newDirectory = nodes.find((node) => {return node.id == connection.target})?.data.value;

                setCurrConnection(connection);
                setOldDir(originDirectory || "error");
                setNewDir(newDirectory || "error")
                setAddPopup(true);
            }



        }, [nodes], 
    )
    const proOptions = {hideAttribution: true}



    return (
        <>
        <FlowgraphContext.Provider 
        value={{dragging, setDragging, connecting, setConnecting, setOldDir, setNewDir, setAddPopup, setEditing, editTemplate, setEditTemplate}}
        >

            <Popup value={addPopup} setValue={setAddPopup}>
                <AddRules 
                oldDir={oldDir} 
                newDir={newDir} 
                edges={edges} 
                nodes={nodes} 
                setPopupStatus={setAddPopup} 
                setEdges={setEdges} 
                connection={currConnection}
                editing={editing}
                editKeywordList={editTemplate}
                
                />
                
            </Popup>
            

            <main className="w-full h-full bg-white text-black">

                <ReactFlow
                className="font-default!" 
                nodes={nodes} 
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}

                onNodeDragStart={() => setDragging(true)}

                onNodeDragStop={onNodeDragStop}

                onConnectStart={() => setConnecting(true)}
                onConnectEnd={() => setConnecting(false)}

   

                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}

                onConnect={onConnect}
                colorMode="dark" 
                fitView

                minZoom={0.4}
                maxZoom={2}

                

                proOptions={proOptions}
                >
                    
                    <Controls className="stroke-on-surface [&_button]:bg-surface-container! [&_button]:border-outline-b! [&_button]:border-4! [&_button]:fill-outline-b! [&_button]:rounded-2xl! [&_button]:mb-2! [&_button]:h-12! [&_button]:w-12! [&_button]:hover:scale-103! [&_button]:transition! [&_button]:ease-in-out!" />
                    <Background className="bg-surface!" />

                    <Panel position="top-left">
                        <TopLeftPanel nodes={nodes} setNodes={setNodes}/>
                    </Panel>

                </ReactFlow>

            </main>
        </FlowgraphContext.Provider>
        </>
        

    )
}