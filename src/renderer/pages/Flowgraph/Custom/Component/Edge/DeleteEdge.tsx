import { useReactFlow } from "@xyflow/react"
import TextButton from "../../../../../Components/TextButton";

export default function DeleteEdgeButton({id}: {id: String}) {

    const reactFlow = useReactFlow();

    const handleDelete = async () => {
        await editEdges();
        await window.electron.saveFlowgraph({nodes: reactFlow.getNodes(), edges: reactFlow.getEdges().filter((edge) => {return edge.id !== id })})

    }

    const editEdges = async () => {
        reactFlow.setEdges(reactFlow.getEdges().filter((edge) => {return edge.id !== id }));
    }

    return (
        <>
            <TextButton color=" bg-red-400 " clickFunction={async () => {await handleDelete()}} text="Delete"/>
        </>
    )
}