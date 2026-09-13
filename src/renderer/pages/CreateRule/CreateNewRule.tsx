import { useNavigate } from "react-router-dom"
import TextButton from "../../Components/TextButton";
import { useState } from "react";
import SetFilePath from "../../Components/SetFilePath";
import SetRegex from "../../Components/SetRegex";
import SubmitRuleButton from "../../Components/SubmitRule";

export default function CreateNewRule() {
    const navigate = useNavigate();

    const [oldDir, setOldDir] = useState("");
    const [newDir, setNewDir] = useState("");
    const [regex, setRegex] = useState("");
    const [query, setQuery] = useState("");
    return (
        <div className="h-dvh w-dvw flex items-center justify-center">
            

            <div className="p-4 rounded-2xl bg-surface-container w-full m-4">

                <TextButton clickFunction={() => {navigate("/")}} text="Return!"/>

                <h1 className="text-5xl font-serif mb-2">Create New Rule</h1>
                <hr className="w-16 h-[1px] bg-primary mb-4"/>

                <SetFilePath value={oldDir} setValue={setOldDir}/>
                <div className="mb-4"/>
                <SetFilePath value={newDir} setValue={setNewDir}/>

                <SetRegex value={regex} setValue={setRegex}/>

                <SubmitRuleButton oldDir={oldDir} newDir={newDir} regex={regex}/>

            </div>
        </div>
    )

}