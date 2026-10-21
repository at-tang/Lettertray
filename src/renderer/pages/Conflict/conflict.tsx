import { useEffect, useRef, useState } from "react"
import TextButton from "../../Components/TextButton";
import { useVisibility } from "../History/Hooks/useVisibiity";
import ConflictEntry from "./ConflictEntry";

export default function Conflict() {

    const loaderRef = useRef(null);
    const loaderVisible = useVisibility(loaderRef);
    
    const [conflicts, setConflicts] = useState([]);
    const rowsPerLoad = 10;
    const [offset, setOffset] = useState(0);

    // When the user reaches the bottom of the list, load more entries
    useEffect(() => {
        if (loaderVisible) getConflicts();
    }, [loaderVisible])

    const getConflicts = async () => {
        const result = await window.electron.getConflictsByPage("", rowsPerLoad, offset);
        setConflicts(conflicts.concat(result));
        setOffset((offset) => {return offset + rowsPerLoad})

    }

    useEffect(() => {
        getConflicts();
        
        
    }, [])

    useEffect(() => {
        console.log("CONFLICTS :========")
        console.log(conflicts);
    }, [conflicts])


    const handleConflictDeletion = (index: number) => {
        conflicts.splice(index, 1)
        setOffset((offset) => {return Math.max(0, offset - 1)})
        
    }
    return (
        <div className="h-full w-full flex items-center justify-center bg-surface">
            <main className="rounded-2xl bg-surface-container p-6 w-9/10 h-9/10 flex flex-col border border-red-800 shadow-lg/50 min-h-0">
            <h1 className="text-5xl mb-2">Conflicts</h1>
            <p>If a specific file/directory fits more than one rule, then they will create a conflict, which you can resolve on this page by selecting what folder to place the conflicted file in.</p>

             <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thumb-primary-container w-full justify-start flex flex-col items-center">
                {
                    conflicts.map((conflict, i) => {
                        return (
                            <div key={i} className={`p-3 w-full ${(i % 2 == 0) ? " bg-surface-container " : " bg-surface-container-h "}`}>
                                <ConflictEntry
                                conflict={conflict}
                                index={i}
                                deleteCallback={handleConflictDeletion}
                                />
        
                                
                            </div>
                        )
                    })
                }

                <div ref={loaderRef} className=""/>
            </div>
            </main>
        </div>
    )
}