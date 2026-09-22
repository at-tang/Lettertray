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

            // Done so that new nodes added do not cover old nodes
            let x = 0; let y = 0;
            let overlapping = true;
            while (overlapping) {
                overlapping = false;
                for (const node of nodes) {
                    if (node.position.x === x && node.position.y === y) {
                        x += 50;
                        y += 50;
                        overlapping = true;
                        break;
                    }
                }
            }



            setNodes((nodes) => [...nodes, {
                id: newId.toString(),
                position: {x: x, y: y},
                data: {value: originPath, label: folderName},
                type: "customNode"
            }]);

            await window.electron.saveFlowgraph({nodes: nodes, edges: getEdges()})
        }

        

    }
    return (
        <>
            <TextButton wFull={true} clickFunction={ async () => {await handleAddClick()}} text="Add Folder"/>
        </>

    )
}