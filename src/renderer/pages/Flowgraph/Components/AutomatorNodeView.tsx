import { AutomatorNode } from "../../../../main/api/types";

export default function AutomatorNodeView({an}: {an: AutomatorNode}) {

    return (
        <div className="bg-container border-primary-container border-2 rounded-2xl px-4 py-1">
            <p>{an.data.label}</p>

        </div>
    )

}