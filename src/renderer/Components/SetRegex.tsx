import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import TextButton from "./TextButton"

export default function SetRegex({value, setValue, value2, setValue2}: {value: string, setValue: Dispatch<SetStateAction<string>>, value2: string, setValue2: Dispatch<SetStateAction<string>>}) {
    const [query, setQuery] = useState("");
    const [mode, setMode] = useState("NAME");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setQuery(inputValue)
        setValue2(inputValue)

        if (mode === "EXTENSION") {
            setValue(`.+[.]${inputValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
        }
        else if (mode === "NAME") {
            setValue(`^.*${inputValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*[.]`)
        } 
        else if (mode === "FOLDER NAME") {
            setValue(`${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
        }
    }

    useEffect(() => {
        if (mode === "EXTENSION") {
            setValue(`.+[.]${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
        }
        else if (mode === "NAME") {
            setValue(`^.*${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*[.]`)
        } 
        else if (mode === "FOLDER NAME") {
            setValue(`${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
        }
    }, [mode])



    return (
        <>
            <input 
            onChange={(e) => {handleChange(e)}}
            value={query}
            placeholder="Set Regex Pattern"
            ></input>

            <p>Current Mode: {mode}</p>
            <div className="flex gap-2">
                <TextButton text="Search for Extension" clickFunction={() => {setMode("EXTENSION")}}/>
                <TextButton text="Search for Name" clickFunction={() => {setMode("NAME")}}/>
            </div>
        </>
    )
}