import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import TextButton from "./TextButton"
import folderImg from '../../../assets/appIcons/folder.png'

export default function SetRegex(
    {value, setValue, value2, setValue2, type, setType, directoriesAllowed, setDirectoriesAllowed, originDir, newDir}: 
    {
    value: string, 
    setValue: Dispatch<SetStateAction<string>>, 
    value2: string, 
    setValue2: Dispatch<SetStateAction<string>>, 
    type: string, 
    setType: Dispatch<SetStateAction<string>>, 
    directoriesAllowed: boolean, 
    setDirectoriesAllowed: Dispatch<SetStateAction<boolean>>,
    originDir: string,
    newDir: string
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


            <div className="flex gap-2 justify-center items-center">

                <p className="">If</p>

                <div className="flex justify-center gap-1 items-center">
                    <img src={folderImg} alt="Folder Icon" className="w-4 h-4 invert"/>
                    <p>{originDir}</p>
                </div>

                <select 
                className="bg-primary-container rounded-full px-4 py-1"
                value={mode} onChange={(e) => {setMode(e.target.value)}}>
                    <option value="CONTAINS">contains "{(value2.length === 0 ? "Keyword" : value2)}"</option>
                    <option value="START">starts with "{value2}"</option>
                    <option value="END">ends with "{value2}"</option>
                    <option value="EXTENSION">has the extension ".{value2}"</option>
                    
                </select>

                <p> {"-->"} Place that file in </p>
                <div className="flex justify-center gap-1 items-center">
                    <img src={folderImg} alt="Folder Icon" className="w-4 h-4 invert"/>
                    <p>{newDir}</p>
                </div>                         
            </div>
        </>
    )
}