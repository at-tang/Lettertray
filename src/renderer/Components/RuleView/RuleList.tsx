import { Rule } from "../../../main/api/types"
import RuleView from "./RuleView"

export default function RuleList({rules, setRules}: {rules: Array<Rule>, setRules: React.Dispatch<React.SetStateAction<never[]>>}) {

    return (
        <div className="rounded-2xl p-4 bg-surface-container flex-col gap-x-4">

        {rules.map((rule: Rule, i) => {
            return (
            <div key={i} className="">
                <RuleView 
                rule={rule} 
                index={i}

                
                />

            </div>
            )
        })}
        </div>
    )
}