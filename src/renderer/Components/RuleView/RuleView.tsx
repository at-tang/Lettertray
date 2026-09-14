import { Rule } from "../../../main/api/types";
import Spacer from "../Spacer";
import TextButton from "../TextButton";

export default function RuleView(

    {rule, index}: 
    {rule: Rule, index: number}) {

    
    const handleDeletion = async () => {
        await window.electron.deleteRule(index);
        window.location.reload();
    }
    
    return (
        <div className="bg-surface-container-h rounded-2xl p-4">
            <h1 className="text-2xl font-serif">{rule.title}</h1>
            <Spacer/>
            <p>Watched Directory: {rule.originDirectory}</p>
            <p>Destination Directory: {rule.newDirectory}</p>
            <p>Keywords to watch: {rule.viewKeyword}</p>
            <Spacer/>
            <TextButton text="Delete" clickFunction={async () => {handleDeletion()}}/>

        </div>
    )

}