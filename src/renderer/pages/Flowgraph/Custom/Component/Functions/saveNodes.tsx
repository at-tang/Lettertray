import { Edge } from "@xyflow/react";

export default async function saveNodes(nodes: Node[], edges: Edge[], setEdges: (payload: Edge[] | ((edges: Edge[]) => Edge[])) => void) {
        let newEdges: Edge[] = [...edges]
        for (let i = 0; i < newEdges.length; i++) {
            newEdges[i].data.value.originDirectory = nodes.find((node) => {return node.id === newEdges[i].source})?.data.value;
            newEdges[i].data.value.newDirectory = nodes.find((node) => {return node.id === newEdges[i].target})?.data.value;
        }
        console.log(JSON.stringify(nodes));

        console.log(JSON.stringify(newEdges));

        setEdges(newEdges);

        const saveFlowgraph = async () => {
            const flowgraph = {nodes: nodes, edges: edges
            }
            await window.electron.saveFlowgraph(flowgraph); 
        }

        await saveFlowgraph();
}