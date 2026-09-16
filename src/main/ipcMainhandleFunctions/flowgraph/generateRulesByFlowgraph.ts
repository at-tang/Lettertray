import { ipcRenderer } from "electron"
import { Rule, SavedFlowgraph } from "../../api/types";

export const generateRulesByFlowgraph = async () => {
      const { default: Store } = await import('electron-store');
      const store = new Store();
      const flowgraph: SavedFlowgraph = await store.get("flowgraph") || {nodes: [], edges: []};
      const edges = flowgraph.edges;
      let newRules: Rule[] = [];

      for (const edge of edges) {
        const currentNewRule: Rule = edge.data.value;
        newRules.push(currentNewRule);
      }

      await store.set("rules", newRules);
}