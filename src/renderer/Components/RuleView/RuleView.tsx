import { Rule } from "../../../main/api/types";

export default function RuleView({rule}: {rule: Rule}) {
    return (
        <div>
            <h1>{rule.title}</h1>
            <p>Watched Directory: {rule.originDirectory}</p>
            <p>Destination Directory: {rule.newDirectory}</p>
            <p>Keywords to watch: {rule.viewKeyword}</p>
        </div>
    )

}