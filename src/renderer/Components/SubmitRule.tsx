import { useNavigate } from "react-router-dom";
import { AutomationRequest } from "../../main/api/types";
import TextButton from "./TextButton"

export default function SubmitRuleButton(
    {oldDir, newDir, regex}:
    {
        oldDir: string,
        newDir: string,
        regex: string
    }

) {

    const navigate = useNavigate();

    const submitRule = async () => {

        let newRule:AutomationRequest = new AutomationRequest ("My Rule!", "MOVE", oldDir, newDir, regex);
        await window.electron.createNewRule(newRule);
        navigate("/");
    }


    return (
        <div className="flex justify-center">
            <TextButton text="Submit" clickFunction={() => {submitRule()}}/>
          
        </div>
    )
}