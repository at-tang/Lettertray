import { useNavigate } from "react-router-dom";
import { AutomationRequest } from "../../main/api/types";
import TextButton from "./TextButton"

export default function SubmitRuleButton(
    {oldDir, newDir, regex, viewKeyword, callback = () => {}}:
    {
        oldDir: string,
        newDir: string,
        regex: string,
        viewKeyword: string,
        callback?: () => any
    }

) {

    const navigate = useNavigate();

    const submitRule = async () => {

        let newRule:AutomationRequest = new AutomationRequest ("My Rule!", "MOVE", oldDir, newDir, regex, viewKeyword);
        await window.electron.createNewRule(newRule);
        callback();

    }


    return (
        <div className="flex justify-center">
            <TextButton text="Submit" clickFunction={() => {submitRule()}}/>
          
        </div>
    )
}