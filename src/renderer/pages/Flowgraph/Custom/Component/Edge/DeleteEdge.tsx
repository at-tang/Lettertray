import { useReactFlow } from "@xyflow/react"
import TextButton from "../../../../../Components/TextButton";

export default function DeleteEdgeButton({id}: {id: String}) {

    const reactFlow = useReactFlow();

    const handleDelete = async () => {
        reactFlow.setEdges(reactFlow.getEdges().filter((edge) => {return edge.id !== id }));

    }

    return (
        <>
            <TextButton clickFunction={async () => {await handleDelete()}} text="Delete"/>
        </>
    )
}