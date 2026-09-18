import { useEffect, useState } from "react";
import { Keyword } from "./AddRules";
import folderImg from '../../../../assets/appIcons/folder.png'
import TextButton from "../TextButton";

export default function AddingRule(
    {
        keywordList,
        setKeywordList,
        index,
        oldDir,
        newDir,
        onDelete
    }:
    {
        keywordList: Keyword[],
        setKeywordList: React.Dispatch<React.SetStateAction<Keyword[]>>
        index: number,
        oldDir: string,
        newDir: string,
        onDelete: (deleteId: number) => any
    }
) {


    const [query, setQuery] = useState(keywordList[index].query); // What to find
    const [mode, setMode] = useState("CONTAINS") // Where to find query


    const setRegex = (query: string) => {

        let newKeywordList = [...keywordList]
        keywordList[index].type = mode;

        if (mode === "START") {
            return (`${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*`)
        }
        else if (mode === "END") {
            return (`.*${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
        }
        else if (mode === "CONTAINS") {
            return (`.*${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*`)
        }
        else if (mode === "EXTENSION") {
            return (`[.]${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
        }
        else { // Default is CONTAINS
            return (`.*${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*`)
        }
    }

    useEffect(() => {
        let newKeywordList = [...keywordList]

        newKeywordList[index].regex = setRegex(newKeywordList[index].query);
        setKeywordList(newKeywordList)
    }, [mode])



    return (

        <main>
            <input 
            onChange={(e) => {
                let newKeywordList = [...keywordList]
                newKeywordList[index].query = e.target.value;
                newKeywordList[index].regex = setRegex(e.target.value);
                setKeywordList(newKeywordList)
            }}
            value={keywordList.at(index)?.query}
            placeholder="Type in the Keyword that will be used to sort files within this folder..."
            maxLength={25}
            className="bg-on-surface text-surface rounded-full px-4 py-1.5 w-full mb-3"
            ></input>


            <div className="flex gap-2 justify-center items-center mb-3">

                <p className="">If any file in</p>

                <div className="flex justify-center gap-1 items-center">
                    <img src={folderImg} alt="Folder Icon" className="w-4 h-4 invert"/>
                    <p>{oldDir.split("/").at(-1)}</p>
                </div>

                <select 
                className="bg-primary-container rounded-full px-4 py-1"
                value={mode} onChange={(e) => {setMode(e.target.value)}}>
                    <option value="CONTAINS">contains "{(keywordList[index].query.length === 0 ? "Keyword" : keywordList[index].query)}"</option>
                    <option value="START">starts with "{(keywordList[index].query.length === 0 ? "Keyword" : keywordList[index].query)}"</option>
                    <option value="END">ends with "{(keywordList[index].query.length === 0 ? "Keyword" : keywordList[index].query)}"</option>
                    <option value="EXTENSION">has extension ".{(keywordList[index].query.length === 0 ? "Keyword" : keywordList[index].query)}"</option>
                    
                </select> 

                <p> {"-->"} Move that file to </p>
                <div className="flex justify-center gap-1 items-center">
                    <img src={folderImg} alt="Folder Icon" className="w-4 h-4 invert"/>
                    <p>{newDir.split("/").at(-1)}</p>
                </div>  

            </div>

            <div className="flex justify-center">
                <TextButton text="Delete" color="bg-red-400" clickFunction={() => {onDelete(index)}}/>

            </div>



            <hr className="my-4 h-2"/>           
        </main>
    )
}