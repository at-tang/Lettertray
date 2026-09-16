import { useReactFlow } from "@xyflow/react";
import { FlowNode } from "../../../Components/TopLeftPanel";
import TextButton from "../../../../../Components/TextButton";

export default function DeleteNodeButton({id}: {id: string}) {

    const reactFlow = useReactFlow();

    const handleDelete = async () => {
        await reactFlow.setNodes(reactFlow.getNodes().filter((node: FlowNode) => {return node.id !== id }));
        await window.electron.saveFlowgraph(
            {nodes: reactFlow.getNodes().filter((node: FlowNode) => {return node.id !== id }), 
            
            // Every edge that was connected to the node is removed
            edges: reactFlow.getEdges().filter((edge) => {edge.data.value.originDirectory !== id && edge.data.value.newDirectory !== id})
            }
        )

    }


    return (
        <>
            <TextButton clickFunction={async () => {await handleDelete()}} text="Delete"/>
        </>
    )

}