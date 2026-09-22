import { BaseEdge, EdgeLabelRenderer, getBezierPath, getSmoothStepPath, getStraightPath } from '@xyflow/react';
import fileIcon from '../../../../../assets/appIcons/file.png'
import { Rule } from '../../../../main/api/types';
import SetAutomationActive from './Component/Edge/SetAutomationActive';
import DeleteEdgeButton from './Component/Edge/DeleteEdge';
import { useContext, useState } from 'react';
import { FlowgraphContext } from '../Flowgraph';
import arrowImg from '../../../../../assets/appIcons/down_arrow.png'
import TextButton from '../../../Components/TextButton';
import CircleAnimation from './Component/Edge/CircleAnimation';
 
export function CustomEdge(
  { id, 
    sourceX, 
    sourceY, 
    targetX, 
    targetY, 
    data, 
    markerEnd,
    sourcePosition,
    targetPosition

  }: 
  {
    id: string, 
    sourceX: number,
    sourceY: number, 
    targetX: number, 
    targetY: number, 
    data: {value: Rule}
  
  }) {

    const newSourceX = sourceX - 10;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition

  });

  /*
  Represents the custom edges, or lines connecting each node. This application uses
  a custom edge aesthetic
  */




  

  const { dragging, setOldDir, setNewDir, setEditing, setAddPopup, setEditTemplate } = useContext(FlowgraphContext);
  const [expand, setExpand] = useState(false);


  
 
  return (
    <>

      <BaseEdge id={id} path={edgePath} className={!data.value.automationActive ? " stroke-green-900! " : " stroke-green-500! " + " stroke-6! bg-green-500!"} markerEnd={markerEnd}/>

      {
      (data.value.automationActive && !dragging ) && 
      <CircleAnimation 
      sourceX={sourceX}
      sourceY={sourceY}
      targetX={targetX}
      targetY={targetY}
      edgePath={edgePath}
      />
      }

      <EdgeLabelRenderer>
        <span 
        className={(data.value.automationActive ? " brightness-100 " : " brightness-50 ") + "bg-surface-container-h border-outline-b border-2 px-12 py-3 rounded-full text-on-surface flex flex-col items-center gap-4 text-lg shadow-lg/50 "}
        
        style={{position: 'absolute', transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`, pointerEvents: 'all',}}
        >
        
        <div className="flex gap-3 items-center">
        <img onClick={() => {setExpand((prev) => {return !prev})}}src={arrowImg}  className={"w-5 h-8 hover:cursor-pointer hover:scale-120 transition " + (expand ? " rotate-0 " : " -rotate-90 ")}/>
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
                    // List every rule that the user has placed within
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
                /*
                This function essentially prepares the necessary data
                to edit the existing edge for AddRules.tsx, rather than
                add a brand new edge
                */
                setEditTemplate([...data.value.data]) // Pass the data of the current edge to the edit menu
                setOldDir(data.value.originDirectory); // Tell the edit menu the 
                setNewDir(data.value.newDirectory);
                setEditing(true); 
                setAddPopup(true); // Open popup menu for edit
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