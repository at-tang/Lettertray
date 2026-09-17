import { useReactFlow } from "@xyflow/react";
import { Rule } from "../../../../../../main/api/types";
import  cogImg  from '../../../../../../../assets/appIcons/gear.png'


export default function SetAutomationActive({rule, id}: {rule: Rule, id: string}) {
    /* 
    This function handles the button to set whether or not
    a rule should be active
    */
   const reactFlow = useReactFlow();

    const handleClick = () => {
        reactFlow.updateEdgeData(id, {value: {...rule, automationActive: !(rule.automationActive)}})

    }


    return (
        <button 
        onClick={() => {handleClick()}}
        className={" h-8 w-8 z-10 rounded-full flex items-center justify-center hover:cursor-pointer hover:scale-120 transition ease-in-out"}>
            <img src={cogImg}  className={(rule.automationActive ? " animate-spin " : " ") + " h-8 w-8 invert "} alt="gear image"/>


        </button>
    )
}