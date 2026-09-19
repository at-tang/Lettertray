import { SavedFlowgraph } from "../../api/types";

export async function saveFlowgraph(flowgraph: SavedFlowgraph) {
  /*
  Given a SavedFlowgraph flowgraph, save the data within to 
  Electron Store.

  SavedFlowgraph:
    nodes: Node[]
    edges: Edge[]

  */
 
  const { default: Store } = await import('electron-store');
  const store = new Store();
  
  try {
    await store.set("flowgraph", flowgraph);
  } catch (err) {
    console.error(err);
  }
}