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
import AddRules from "../../Components/AddRules/AddRules";

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
    

    /*
    // Every change to the nodes/edges of the flowgraph will update the saved flowgraph in storage
    useEffect(() => {

        // When nodes are updated, make sure the folders each node represents is reflected in the edges as well
        // This is mainly for swapping folders in place
        
        let newEdges: Edge[] = [...edges]
        for (let i = 0; i < newEdges.length; i++) {
            newEdges[i].data.value.originDirectory = nodes.find((node) => {return node.id === newEdges[i].source})?.data.value;
            newEdges[i].data.value.newDirectory = nodes.find((node) => {return node.id === newEdges[i].target})?.data.value;
        }
            

        setEdges(newEdges);

        const saveFlowgraph = async () => {
            const flowgraph = {nodes: nodes, edges: edges
            }
            if (initialLoadDone) await window.electron.saveFlowgraph(flowgraph); 
        }

        saveFlowgraph();

    }, [nodes])


    */

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


    /*
    const onEdgesDelete = async (edges: Edge[]) => {
       // When a node is deleted, also delete every Rule that uses the folder it represents 
       await window.electron.handleFlowgraphEdgeDelete(edges);
        
    }

    const onNodesDelete = async (nodes: Node[]) => {
        // When deleting a node, delete every rule where each deleted node is either the origin or destination
        await window.electron.handleFlowgraphNodeDelete(nodes);
    }
        */


    // When establishing new connections (connecting one node to another), open the "Add Rule" popup
    const [oldDir, setOldDir] = useState("");
    const [newDir, setNewDir] = useState("");
    const [currConnection, setCurrConnection] = useState<Connection>();
    const onConnect = useCallback(
        (connection: Connection) => {

            // Currently, edges with the same source and connection are not permitted
            // This may change in the future
            if (edges.some((edge) => {return edge.source === connection.source && edge.target === connection.target}) === true) {
                console.log("Edge Source: " + connection.source)
                console.log("Edge Target: " + connection.target)
                return;
            } else {
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


    // <AddRulePopup oldDir={oldDir} newDir={newDir} nodes={nodes} edges={edges} connection={currConnection} setEdges={setEdges} setPopupStatus={setAddPopup}/>

    return (
        <>
        <FlowgraphContext.Provider value={{dragging, setDragging, connecting, setConnecting}}>
            <Popup value={addPopup} setValue={setAddPopup}>
                <AddRules oldDir={oldDir} newDir={newDir} edges={edges} nodes={nodes} setPopupStatus={setAddPopup} setEdges={setEdges} connection={currConnection}/>
                
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