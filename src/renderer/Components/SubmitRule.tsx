import { useNavigate } from "react-router-dom";
import { AutomationRequest, Rule } from "../../main/api/types";
import TextButton from "./TextButton"

export default function SubmitRuleButton(
    {oldDir, newDir, regex, viewKeyword, callback = () => {}, directoriesAllowed = false, caseSensitive = false, type}:
    {
        oldDir: string,
        newDir: string,
        regex: string,
        viewKeyword: string,
        callback?: (rule: Rule) => any,
        directoriesAllowed: boolean,
        caseSensitive: boolean,
        type: string
    }

) {

    const navigate = useNavigate();

    const submitRule = async () => {

        // Generate a sequential ID
        let newId: string = await window.electron.generateId();
        let newIdNumber: number = (Number) (newId);

        let rule: Rule = {
            id: newIdNumber,
            title: "My Rule",
            type: type,
            originDirectory: oldDir,
            newDirectory: newDir,
            keyword: regex,
            automationActive: true,
            viewKeyword: viewKeyword,
            directoriesAllowed: directoriesAllowed,
            caseSensitive: caseSensitive

        }

        //let newRule:AutomationRequest = new AutomationRequest ("My Rule!", "MOVE", oldDir, newDir, regex, viewKeyword);
        await window.electron.createNewRule(rule);
        callback(rule);

    }


    return (
        <div className="flex justify-center">
            <TextButton text="Submit" clickFunction={() => {submitRule()}}/>
          
        </div>
    )
}