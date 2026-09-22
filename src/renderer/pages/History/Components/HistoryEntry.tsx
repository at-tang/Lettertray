import { HistoryEntry } from "../../../../main/classes/History";

export default function HistoryEntry(
    {
    originDir,
    newDir,
    fileName,
    time, 
    extraClasses}: 
    {originDir: string,
    newDir: string,
    fileName: string,
    time: number
     extraClasses: string
    
    }) {
    const newDirName = newDir.split(/[/\\]/).at(-1);
    const date = new Date(time);
    return (
        <div className={` ${extraClasses} flex gap-3 py-2 pl-3`}>
            <p><span className=" text-primary font-extrabold">"{fileName}" {" "}</span> was moved to {newDirName} -- {date.toDateString()}, {date.getHours()}:{date.getMinutes()}</p>
            


        </div>
    )
}