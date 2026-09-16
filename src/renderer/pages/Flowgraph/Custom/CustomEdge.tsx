import { BaseEdge, EdgeLabelRenderer, getBezierPath, getStraightPath } from '@xyflow/react';
import fileIcon from '../../../../../assets/appIcons/file.png'
import { Rule } from '../../../../main/api/types';
import SetAutomationActive from './Component/Edge/SetAutomationActive';
import DeleteEdgeButton from './Component/Edge/DeleteEdge';
import { useContext, useState } from 'react';
import { FlowgraphContext } from '../Flowgraph';
 
export function CustomEdge({ id, sourceX, sourceY, targetX, targetY, data, markerEnd }: {id: string, sourceX: number, sourceY: number, targetX: number, targetY: number, data: {value: Rule}}) {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,

  });

  /*
  Represents the custom edges, or lines connecting each node. This application uses
  a custom edge aesthetic
  */

  const dy = Math.abs(sourceY - targetY)
  const dx = Math.abs(sourceX - targetX)
  const timeTaken = Math.sqrt(dx * dx + dy * dy) / 150

  const { dragging } = useContext(FlowgraphContext);


  
 
  return (
    <>

      <BaseEdge id={id} path={edgePath}  className={(!data.value.automationActive ? " stroke-green-900! " : " stroke-green-500! ") + " stroke-6! bg-green-500! " } markerEnd={markerEnd}/>

      { (data.value.automationActive && !dragging ) &&

      <>
      
        <circle r="10"  className="stroke-green-500! fill-green-500!">
          <animateMotion dur={`${timeTaken}s`} repeatCount="indefinite" path={edgePath} calcMode="linear"/>
        </circle>

        <circle r="8"  className="stroke-green-500! fill-green-500! animate-ping!">
          <animateMotion dur={`${timeTaken}s`} repeatCount="indefinite" path={edgePath} calcMode="linear"/>
        </circle>

      </>

      }

      <EdgeLabelRenderer>
        <span 
        className={(data.value.automationActive ? " brightness-100 " : " brightness-50 ") + "bg-surface-container-h border-outline-b border-4 px-8 py-2 rounded-2xl text-on-surface flex items-center gap-2"}
        
        style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}

          >
            <img src={fileIcon} className="w-5 h-5 invert"/>
            <div>
                {data.value.keyword}
                <p>Origin: {data.value.originDirectory}</p>
                <p>New: {data.value.newDirectory}</p>
                
            </div>

            <SetAutomationActive rule={data.value} id={id}/>

            <DeleteEdgeButton id={id}/>

            

            
          </span>
      </EdgeLabelRenderer>

      
      
    </>
  );
}