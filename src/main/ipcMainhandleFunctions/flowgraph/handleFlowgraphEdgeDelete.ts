import { Edge } from '@xyflow/react';
import { Rule } from '../../api/types';

export const handleFlowgraphEdgeDelete = async (edges: Edge[]) => {
      const { default: Store } = await import('electron-store');
      const store = new Store();
      const rules: Rule[] = await store.get("rules");
      let newRules = [...rules] // Create a shallow copy
    
      // For each edge deleted
      for (const edge of edges) {
        // Filter out every rule where the originDir and newDir correspond to the edge's source and target respectively
        newRules = [...newRules.filter((rule) => {return !(rule.newDirectory === edge.target && rule.originDirectory === edge.source)})]
      }
    
      store.set("rules", newRules);
      return

}