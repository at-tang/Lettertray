import { useReactFlow } from "@xyflow/react";
import TextButton from "../../../../Components/TextButton";


export default function AddFolder() {

    const {setNodes, getEdges, getNodes} = useReactFlow();

    const handleAddClick = async () => {
        const originPath = await window.electron.selectFolder();
        if (!originPath) return;

        const nodes = getNodes();

        const folderName = originPath.split(/[\\/]/).pop() ?? originPath;
        const duplicate = nodes.some((node) => node.data.value === originPath);

        if (!duplicate) { // Prevent the creation of a duplicate


            const newId: number = await window.electron.generateId();



            setNodes((nodes) => [...nodes, {
                id: newId.toString(),
                position: {x: 0, y: 0},
                data: {value: originPath, label: folderName},
                type: "customNode"
            }]);

            await window.electron.saveFlowgraph({nodes: nodes, edges: getEdges()})
        }

        

    }
    return (
        <>
            <TextButton color="bg-green-600" wFull={true} clickFunction={ async () => {await handleAddClick()}} text="Add Folder"/>
        </>

    )
}