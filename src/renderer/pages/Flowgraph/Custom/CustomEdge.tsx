import { BaseEdge, EdgeLabelRenderer, getBezierPath, getStraightPath } from '@xyflow/react';
import fileIcon from '../../../../../assets/appIcons/file.png'
import { Rule } from '../../../../main/api/types';
import SetAutomationActive from './Component/Edge/SetAutomationActive';
import DeleteEdgeButton from './Component/Edge/DeleteEdge';
import { useContext, useState } from 'react';
import { FlowgraphContext } from '../Flowgraph';
import arrowImg from '../../../../../assets/appIcons/down_arrow.png'
import TextButton from '../../../Components/TextButton';
 
export function CustomEdge(
  { id, 
    sourceX, 
    sourceY, 
    targetX, 
    targetY, 
    data, 
    markerEnd,

  }: 
  {
    id: string, 
    sourceX: number,
    sourceY: number, 
    targetX: number, 
    targetY: number, 
    data: {value: Rule}
  
  }) {
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

  const { dragging, setOldDir, setNewDir, setEditing, setAddPopup, setEditTemplate } = useContext(FlowgraphContext);
  const [expand, setExpand] = useState(false);


  
 
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
        className={(data.value.automationActive ? " brightness-100 " : " brightness-50 ") + "bg-surface-container-h border-outline-b border-4 px-6 py-3 rounded-2xl text-on-surface flex flex-col items-center gap-4 text-lg "}
        
        style={{position: 'absolute', transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`, pointerEvents: 'all',}}
        >
        
        <div className="flex gap-3 items-center">
        <img onClick={() => {setExpand((prev) => {return !prev})}}src={arrowImg}  className={"w-7 h-12 hover:cursor-pointer hover:scale-120 transition " + (expand ? " rotate-0 " : " -rotate-90 ")}/>
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
                    data.value.data.map((rule, i) => {
                      return (
                        <p key={i}>{`${rule.type}: \"${rule.type === "EXTENSION" ? "." : ""}${rule.query}\"`}</p>
                      )
                    })
                  }
        
                </div>

            <div className="flex justify-center gap-3 items-center">
              <SetAutomationActive rule={data.value} id={id}/>

              <TextButton text="Edit" clickFunction={() => {
                setEditTemplate([...data.value.data])
                setOldDir(data.value.originDirectory);
                setNewDir(data.value.newDirectory);
                setEditing(true);
                setAddPopup(true);
                return;
              }}/>

              <DeleteEdgeButton id={id}/>
            </div>
          </>
        }



            

       
          </span>
      </EdgeLabelRenderer>

      
      
    </>
  );
}