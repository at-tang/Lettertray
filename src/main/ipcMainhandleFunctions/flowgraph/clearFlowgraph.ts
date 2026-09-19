export async function clearFlowgraph() {
  // Complete clear of the user's flowgraph
  const { default: Store } = await import('electron-store');
  const store = new Store();
  
  store.delete("rules");
  store.delete("flowgraph");
  return; 
}