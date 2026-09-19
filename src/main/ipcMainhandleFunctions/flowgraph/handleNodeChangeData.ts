import { Rule, SavedFlowgraph } from '../../api/types';

export async function handleNodeChangeData(oldPath: string, newPath: string) {
  const { default: Store } = await import('electron-store');
  const store = new Store();

  const flowgraph: SavedFlowgraph = await store.get("flowgraph") || [];
  const rules: Rule[] = [flowgraph.edges.map((edge) => edge.data.value)]

  let newRules = [...rules]

  // Check that new folder is not already part of the flowgraph
  // If it is, return false, ending the program early and denying any altercation
  // In the future, there may be an option to SWAP nodes
  for (const rule of rules) {
    if (rule.originDirectory === newPath || rule.newDirectory === newPath || oldPath === newPath) {
      return false;
    }
  }

  for (const rule of newRules) {
    if (rule.originDirectory === oldPath) {
      rule.originDirectory = newPath;
    }

    if (rule.newDirectory === oldPath) {
      rule.newDirectory = newPath;
    }
  }

  return true;

}