import { useNavigate } from "react-router-dom"
import TextButton from "../../Components/TextButton";
import { addEdge, applyEdgeChanges, applyNodeChanges, Background, Connection, Controls, Edge, EdgeChange, Node, NodeChange, Panel, ReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import { AutomationRequest, AutomatorNode, Data, Position } from "../../../main/api/types";
import '@xyflow/react/dist/style.css';
import TopLeftPanel from "./Components/TopLeftPanel";
import Popup from "../../Components/Popup";
import AddRulePopup from "./Components/AddRulePopup";
import { CustomEdge } from "./Custom/CustomEdge";
import CustomNode from "./Custom/CustomNode";

export default function Flowgraph() {
    const navigate = useNavigate();

    const [addPopup, setAddPopup] = useState(false); // Controls if the popup for adding a new rule appears

    type FlowNode = Node<{value: string; label: string}>;

    const [nodes, setNodes] = useState<FlowNode[]>([

    ]
    );

    const [initialLoadDone, setInitialLoadDone] = useState(false);

    const [edges, setEdges] = useState<Edge[]>([]);

    useEffect(() => {
        const saveFlowgraph = async () => {
            const flowgraph = {
                nodes: nodes,
                edges: edges
            }

            if (initialLoadDone) {
                await window.electron.saveFlowgraph(flowgraph); 
            } 
        }
        saveFlowgraph();

    }, [nodes, edges])

    useEffect(() => {
        const loadFlowgraph = async () => {
            const flowgraph = await window.electron.loadFlowgraph();
            setNodes(flowgraph.nodes)
            setEdges(flowgraph.edges);
            setInitialLoadDone(true);
        }
        loadFlowgraph();


    }, [])

    const nodeTypes = {
        customNode: CustomNode
    }

    const edgeTypes = {
        customEdge: CustomEdge
    }

    const onNodesChange = useCallback((changes: NodeChange<FlowNode>[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)), [], )

    const onEdgesChange = useCallback((changes: EdgeChange<Edge>[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)), [], );

    const onEdgesDelete = async (edges: Edge[]) => {
        /*
        When a node is deleted, also delete every Rule that uses the folder it represents 
        */
       await window.electron.handleFlowgraphEdgeDelete(edges);
        
    }

    const onNodesDelete = async (nodes: Node[]) => {
        await window.electron.handleFlowgraphNodeDelete(nodes);
    }


    const [oldDir, setOldDir] = useState("");
    const [newDir, setNewDir] = useState("");
    const [currConnection, setCurrConnection] = useState<Connection>();
    const onConnect = useCallback(
        (connection: Connection) => {
            setCurrConnection(connection);
            //setEdges((oldEdges) => addEdge(connection, oldEdges));
            setOldDir(connection.source);
            setNewDir(connection.target)
            setAddPopup(true);


        }, [setEdges], 
    )

    //<TextButton clickFunction={() => {navigate("/")}} text="Return"/>

    return (
        <>
            <Popup value={addPopup} setValue={setAddPopup}>
                <AddRulePopup oldDir={oldDir} newDir={newDir} connection={currConnection} setEdges={setEdges} setPopupStatus={setAddPopup}/>
            </Popup>
            

            <div className="w-dvw h-dvh bg-white text-black">

                <ReactFlow 
                nodes={nodes} 
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}

                onEdgesDelete={onEdgesDelete}
                onNodesDelete={onNodesDelete}

                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}

                onConnect={onConnect}
                colorMode="dark" 
                fitView
                >

                    

                    <Controls/>
                    <Background className="bg-black" />
                    <Panel position="top-left">
                        <TopLeftPanel nodes={nodes} setNodes={setNodes}/>
                    </Panel>
                </ReactFlow>

            </div>
        </>
        

    )
}