import { useEffect, useState } from "react";
import AddingRule from "./AddingRule";
import TextButton from "../TextButton";
import SubmitRuleButton from "../SubmitRule";
import { addEdge, Connection, Edge, MarkerType } from "@xyflow/react";
import { Rule } from "../../../main/api/types";

export class Keyword {
    regex: string;
    query: string;
    type: string;
    id: number;

    constructor(regex: string = "", query: string = "", type: string = "", id: number = 0) {
        this.regex = regex;
        this.query = query;
        this.type = type;
        this.id = id;
    }
}

export default function AddRules(
    {
        oldDir,
        newDir,
        connection,
        nodes,
        edges,
        setPopupStatus,
        setEdges,
        editedKeywordList = [new Keyword("", "", "CONTAINS", 0)]
    }: {
        oldDir: string,
        newDir: string,
        connection: Connection,
        nodes: Node[],
        edges: Edge[],
        setPopupStatus: React.Dispatch<React.SetStateAction<boolean>>,
        setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
        editedKeywordList?: Keyword[]
    }
) {

    const [keywordList, setKeywordList] = useState<Keyword[]>(editedKeywordList)
    const [finalRegex, setFinalRegex] = useState("");

    const [errorText, setErrorText] = useState("");
    const [idCounter, setIdCounter] = useState(2);


    useEffect(() => {
        console.log(keywordList);
        

    }, [keywordList])

    useEffect(() => {
        console.log(finalRegex)
    }, [finalRegex])


    const handleSubmit = async () => {
        // Generate a sequential ID
        let newId: string = await window.electron.generateId();
        let newIdNumber: number = (Number) (newId);

        // Create the combined Regex
        let newRegex = "";
        let newView = "";
        for (let i = 0; i < keywordList.length; i++) {
            newRegex += `(${keywordList[i].regex})`
            newView += `${keywordList[i].query}`
            if (i !== keywordList.length - 1) {
                newRegex += "|";
                newView += ", "
            
            }
        }

        let rule: Rule = {
            id: newIdNumber,
            title: "My Rule",
            type: "default",
            originDirectory: oldDir,
            newDirectory: newDir,
            keyword: newRegex,
            automationActive: true,
            viewKeyword: newView,
            directoriesAllowed: true,
            caseSensitive: false,
            data: keywordList
        }    

        const newEdge: Edge = {
            id: `__${connection.source}~${connection.target}`,
            source: connection.source,
            target: connection.target,
            sourceHandle: connection.sourceHandle,
            targetHandle: connection.targetHandle,
            type: 'customEdge',
            data: {value: rule},
            markerEnd: {
                type: MarkerType.ArrowClosed,
            },
                            
        }
                    
        setEdges((oldEdges) => addEdge(newEdge, oldEdges)); // Add edge
        setPopupStatus(false); // Close this popup
        
    }




    return (

        <>
        <h1 className="text-center text-3xl mb-1">Create Rule</h1>
        <hr className="mb-4"/>
        {keywordList.map((keyword, i) => {
            return (
                <div key={i}>
                    <AddingRule 
                    keywordList={keywordList} 
                    setKeywordList={setKeywordList} 
                    index={i} 
                    oldDir={oldDir} 
                    newDir={newDir} 
                    onDelete={(deleteId: number) => {
                        setKeywordList((prev) => {return prev.filter((keyword, i) => {return deleteId !== keyword.id})})

                        keywordList.forEach((keyword, i) => {keyword.id = i; return;})
                        setIdCounter((prev) => {return prev++});

                    }}
                    />
                </div>
                

            )
        })}
        <footer className="flex justify-center gap-3">

            <TextButton text="Add A New Rule" clickFunction={() => {setKeywordList((prev) => {return prev.concat([new Keyword("", "", "CONTAINS", prev.length)])})}}/>

                
            <TextButton text="Save All" color="bg-green-600" clickFunction={() => {

                if (keywordList.length === 0) {
                    setErrorText("Please enter parameters for sorting.")
                    return
                }


                for (let i = 0; i < keywordList.length; i++) {
                    if (keywordList[i].query.length === 0) {
                        setErrorText("There are rules that currently have blank keywords.")
                        return                    
                    }

                    if (keywordList[i].query.search(/[\\\/\:\*\?\"\<\>\|]/) !== -1) {
                        setErrorText("Your keyword cannot contain special characters like \/ \\ \: \* \? \" \< \> or \|.")
                        return;                    
                    }
                }


                
                handleSubmit();
            }}/>
            
        </footer>

        <p className="text-red-500 text-center">{errorText}</p>
        </>

    )
    
}