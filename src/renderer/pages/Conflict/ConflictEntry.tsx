import { Rule } from "../../../main/api/types";
import TextButton from "../../Components/TextButton";

export default function ConflictEntry({conflict, index, deleteCallback}: {conflict: any, index: number, deleteCallback: (index: number) => void}) {

    const conflictingRules: any[] = JSON.parse(conflict.new_directories).paths

    const handleConflictDeletion = (id: number) => {
        window.electron.deleteConflictById(id)
        deleteCallback(index);
    }

    const handleConflictResolution = async (rule: Rule) => {
        try {
            await window.electron.moveSingleFile(conflict.origin_directory, rule)
            handleConflictDeletion(conflict.id)
        }
        catch {
            // Place error message here
            console.log("Could not resolve conflict!")
        } 
    }

    // <TextButton text="Delete" clickFunction={() => {handleConflictDeletion(conflict.id)}}/>
    return (
        <div className="w-full bg-surface-container-h">
            <p className="text-center mb-6"><b className="text-red-400">Conflicted File: </b>{conflict.origin_directory}</p>
            
            <div className="flex flex-col gap-3 w-3xl items-center justify-center bg-surface-container-low w-full">
                {
                    conflictingRules.map((rule) => {
                        return (

                            <TextButton text={`Move to ${rule.newDirectory}`}
                            clickFunction={() => {handleConflictResolution(rule)}}
                            />
                            
                        )
                    })
                }
            </div>

        </div>
    )
}