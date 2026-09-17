import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import TextButton from "./TextButton"

export default function SetRegex(
    {value, setValue, value2, setValue2, type, setType, directoriesAllowed, setDirectoriesAllowed}: 
    {
    value: string, 
    setValue: Dispatch<SetStateAction<string>>, 
    value2: string, 
    setValue2: Dispatch<SetStateAction<string>>, 
    type: string, 
    setType: Dispatch<SetStateAction<string>>, 
    directoriesAllowed: boolean, 
    setDirectoriesAllowed: Dispatch<SetStateAction<boolean>>
}
    


) {


    const [query, setQuery] = useState("");
    const [mode, setMode] = useState("CONTAINS");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setQuery(inputValue)
        setValue2(inputValue)

        determineRegex();
    }

    useEffect(() => {
        setType(mode);
        determineRegex();
    }, [mode, query])

    const determineRegex = () => {
        let folderExtension = "";
        if (!directoriesAllowed) {
            folderExtension = "[.].*"
        }

        if (mode === "START") {
            setValue(`${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*${folderExtension}`)
        }
        else if (mode === "END") {
            setValue(`.*${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}${folderExtension}`)
        }
        else if (mode === "CONTAINS") {
            setValue(`.*${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*${folderExtension}`)
        }
        else if (mode === "EXTENSION") {
            setValue(`[.]${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
        }
    }



    return (
        <>
            <input 
            onChange={(e) => {handleChange(e)}}
            value={query}
            placeholder="Type in the Keyword that will be used to sort files within this folder..."
            maxLength={25}
            className="bg-on-surface text-surface rounded-full px-4 py-1.5 w-full"
            ></input>

            <div className="flex gap-3">
                Sort Folders?
                <input type="checkbox" checked={directoriesAllowed} onChange={() => setDirectoriesAllowed((prev) => {return !prev})}
                />
                
            </div>


            <div className="flex gap-2 justify-center">
                <TextButton text={`Starts with ` + (query.length !== 0 ? `${query}` : "Keyword") } clickFunction={() => {setMode("START")}}/>
                <TextButton text={`Ends with ` + (query.length !== 0 ? `${query}` : "Keyword") } clickFunction={() => {setMode("END")}}/>
                <TextButton text={`Contains ` + (query.length !== 0 ? `${query}` : "Keyword") } clickFunction={() => {setMode("CONTAINS")}}/>
                <TextButton text={`Has Extension .` + (query.length !== 0 ? `${query}` : "Keyword") } clickFunction={() => {setMode("EXTENSION")}}/> 
                                  
            </div>
        </>
    )
}