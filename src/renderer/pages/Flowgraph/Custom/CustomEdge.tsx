import { BaseEdge, EdgeLabelRenderer, getBezierPath, getStraightPath } from '@xyflow/react';
import fileIcon from '../../../../../assets/appIcons/file.png'
import { Rule } from '../../../../main/api/types';
import SetAutomationActive from './Component/Edge/SetAutomationActive';
import DeleteEdgeButton from './Component/Edge/DeleteEdge';
import { useContext, useState } from 'react';
import { FlowgraphContext } from '../Flowgraph';
import arrowImg from '../../../../../assets/appIcons/down_arrow.png'
 
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
  const [expand, setExpand] = useState(false);

  const createView = () => {
        let info = data.value.data;
        let result = "";

        for (let i = 0; i < info.length; i++) {
            result += `${info[i].type}: \"${info[i].type === "EXTENSION" ? "." : ""}${info[i].query}\"`
            if (i !== info.length - 1) result += "\n"
        }

        return result;
  }



  
 
  return (
    <>

      <BaseEdge id={id} path={edgePath}  className={(!data.value.automationActive ? " stroke-green-900! " : " stroke-green-500! ") + " stroke-6! bg-green-500! " } markerEnd={markerEnd}/>

      {
      (data.value.automationActive && !dragging ) &&

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
        className={(data.value.automationActive ? " brightness-100 " : " brightness-50 ") + "bg-surface-container-h border-outline-b border-4 px-8 py-4 rounded-2xl text-on-surface flex flex-col items-center gap-4 text-lg "}
        
        style={{position: 'absolute', transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`, pointerEvents: 'all',}}
        >
        
        <div className="flex gap-3 items-center">
        <img onClick={() => {setExpand((prev) => {return !prev})}}src={arrowImg}  className={"w-5 h-8 hover:cursor-pointer " + (expand ? " rotate-0 " : " rotate-270 ")}/>
        { !expand &&
        <>
          <p className="text-xl">{(data.value.data.length === 1 ? `${data.value.data.at(0)?.type}: \"${data.value.data.at(0).query}\"` : `${data.value.data.length} Rules`)}</p>
          <SetAutomationActive rule={data.value} id={id}/>
        </>
        }
        </div>
        


          { expand &&
          <>

            <div className="text-xl">
                  {
                    data.value.data.map((rule) => {
                      return (
                        <p>{`${rule.type}: \"${rule.type === "EXTENSION" ? "." : ""}${rule.query}\"`}</p>
                      )
                    })
                  }
        
                </div>

            <div className="flex justify-center gap-3 items-center">
              <SetAutomationActive rule={data.value} id={id}/>

              <DeleteEdgeButton id={id}/>
            </div>
          </>
        }



            

            
          </span>
      </EdgeLabelRenderer>

      
      
    </>
  );
}