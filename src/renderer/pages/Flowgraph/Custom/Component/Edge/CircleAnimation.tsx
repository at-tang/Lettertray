import { useRef } from "react";

export default function CircleAnimation(
    {sourceX, sourceY, targetX, targetY, edgePath}:
    {
        sourceX: number,
        sourceY: number,
        targetX: number,
        targetY: number,
        edgePath: string
    }
) {

      // Circle Animation Configuration

    const circleSpeed = 100; // The speed at which the circle moves across the path (the more the faster)
    const delay = 0.5; // How many seconds between animation cycles


    const dy = Math.abs(sourceY - targetY)
    const dx = Math.abs(sourceX - targetX)
    const timeTaken = Math.sqrt(dx * dx + dy * dy) / circleSpeed
    
    const totalDur = timeTaken + delay; // Total duration of animation

    const fadeInRatio = Math.min(0.2, timeTaken) / totalDur; // Point of time when circle fades in from the source
    const moveRatio = timeTaken / totalDur;
    const fadeStartRatio = (timeTaken - 0.3) / totalDur; // Point of time when circle fades out as it approaches target
    const pauseRatio = timeTaken / totalDur; // Point of time when circle is delaying itself
    
    
    


    return (
        <>
        <circle r="10"  className="stroke-green-500! fill-green-500!">
          <animateMotion 
          dur={`${totalDur}s`} 
          repeatCount="indefinite" 
          path={edgePath} 
          calcMode="linear"
          keyTimes={`0; ${pauseRatio}; 1`}
          keyPoints="0; 1; 1"
          />
          <animate
              attributeName="opacity"
              dur={`${totalDur}s`}
              repeatCount="indefinite"
              keyTimes={`0; ${fadeInRatio}; ${fadeStartRatio}; ${moveRatio}; 1`}
              values="0; 1; 1; 0; 0"
            />
        </circle>

        <circle r="10"  className="stroke-green-500! fill-green-500! animate-ping!">
          <animateMotion 
          dur={`${totalDur}s`} 
          repeatCount="indefinite" 
          path={edgePath} 
          calcMode="linear"
          keyTimes={`0; ${pauseRatio}; 1`}
          keyPoints="0; 1; 1"          
          />
          <animate
              attributeName="opacity"
              dur={`${totalDur}s`}
              repeatCount="indefinite"
              keyTimes={`0; ${fadeInRatio}; ${fadeStartRatio}; ${moveRatio}; 1`}
              values="0; 1; 1; 0; 0"
            />
        </circle>        
        </>
    )
}