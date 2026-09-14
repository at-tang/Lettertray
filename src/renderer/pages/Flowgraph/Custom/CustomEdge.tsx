import { BaseEdge, EdgeLabelRenderer, getBezierPath, getStraightPath } from '@xyflow/react';
import fileIcon from '../../../../../assets/appIcons/file.png'
 
export function CustomEdge({ id, sourceX, sourceY, targetX, targetY, data }: {id: string, sourceX: number, sourceY: number, targetX: number, targetY: number, data: {keyword: string}}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,

  });

  /*
  Represents the custom edges, or lines connecting each node. This application uses
  a custom edge aesthetic
  */

  
 
  return (
    <>
      <BaseEdge id={id} path={edgePath} color="#f6339a" className=""/>

      
      
      <circle r="6" fill="#ff0073" className="bg-primary">
        <animateMotion dur="2s" repeatCount="indefinite" path={edgePath}  />
      </circle>

      <EdgeLabelRenderer>
        <span className="bg-surface-container-h px-8 py-2 rounded-2xl text-on-surface flex items-center gap-2" style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}

          >
            <img src={fileIcon} className="w-5 h-5 invert"/>
            {data.keyword}
            
          </span>
      </EdgeLabelRenderer>

      
      
    </>
  );
}