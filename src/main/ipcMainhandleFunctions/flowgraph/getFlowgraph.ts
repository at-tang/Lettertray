export async function getFlowgraph() {
    /*
    Retrieves the saved flowgraph and returns it. 
    */

    const { default: Store } = await import('electron-store');
    const store = new Store();

    if (!store.has("flowgraph")) return {nodes: [], edges: []};
    const result = await store.get("flowgraph")
    return result;
}