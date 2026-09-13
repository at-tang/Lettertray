import { Rule } from "../../../main/api/types"
import RuleView from "./RuleView"

export default function RuleList({rules}: {rules: Array<Rule>}) {
    return (
        <>

        {rules.map((rule: Rule, i) => {
            return (
            <div key={i}>
                <RuleView rule={rule}/>
            </div>
            )
        })}
        </>
    )
}