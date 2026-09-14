export const handleFlowgraphNodeDelete = async (nodes: Node[]) => {
  const { default: Store } = await import('electron-store');
  const store = new Store();
  
  const rules: Rule[] = await store.get("rules")
  let newRules = [...rules];

  // For each node deleted
  for (const node of nodes) {
    newRules = [...newRules.filter((rule) => {return !(rule.originDirectory === node.data.value || rule.newDirectory === node.data.value)})]
  }

  await store.set("rules", newRules);
  return;
}