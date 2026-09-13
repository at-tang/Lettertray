import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import TextButton from "./TextButton"

export default function SetRegex({value, setValue}: {value: string, setValue: Dispatch<SetStateAction<string>>}) {
    const [query, setQuery] = useState("");
    const [mode, setMode] = useState("NAME");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)

        if (mode === "EXTENSION") {
            setValue(`.+[.]${query}`)
        }
        else if (mode === "NAME") {
            setValue(`^${query}.*[.]`)
        }
    }



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