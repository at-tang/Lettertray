import { useEffect, useRef, useState } from "react";
import HistoryEntry from "./Components/HistoryEntry";
import { useVisibility } from "./Hooks/useVisibiity";

export default function History() {
    const LIMIT = 10;
    const [offset, setOffset] = useState(0);
    const [historyList, setHistoryList] = useState([]);
    const [query, setQuery] = useState("");

    const loaderRef = useRef(null);
    const loaderVisible = useVisibility(loaderRef);

    const getHistoryByPage = async () => {
        const result = await window.electron.getHistoryByPage(query, LIMIT, offset)
        console.log("Result received!")
        console.log(result)
        setHistoryList((prev) => {return prev.concat(result)});
        setOffset((prev) => {return prev + LIMIT});
    }

    const changeQuery = async () => {
        const result = await window.electron.getHistoryByPage(query, LIMIT, 0)
        console.log("Result received!")
        console.log(result)
        setHistoryList(result);
        setOffset((prev) => {return LIMIT});
    }

    useEffect(() => { // When the user reaches the bottom of the list, load more entries
        if (loaderVisible) getHistoryByPage();
    }, [loaderVisible])

    useEffect(() => {
        changeQuery();
    }, [query])


    return (
        <>
            <div className="h-full w-full flex items-center justify-center bg-surface">
                <main className="rounded-2xl bg-surface-container-low p-4 w-9/10 h-9/10 flex flex-col">
                    <h1 className="text-5xl mb-2">History</h1>
                    <p className="mb-2">All file/directory moves automatically conducted by the program will be documented here. Note that only the latest 500 moves will be saved.</p>

                    <input
                    value={query}
                    onChange={(e) => {setQuery(e.target.value)}}
                    placeholder="Search for specific files..." 
                    className="px-3 py-2 bg-on-surface text-surface-container rounded-full mb-4"/>


                    <div className=" h-80 overflow-y-auto scrollbar-thumb-primary-container">

                    { (historyList.length !== 0) &&
                        historyList.map((entry, i) => {
                            return (
                                <div key={i}>
                                    <HistoryEntry originDir={entry.origin_dir} newDir={entry.new_dir} fileName={entry.file_name} time={entry.time} extraClasses={`${(i % 2 == 0 ? " bg-surface-container " : " bg-surface-container-h ")}`}/>
                                </div>
                            )
                        })
                    }

                    <div ref={loaderRef} className=""/>

                    </div>

                    

                </main>

            </div>
        </>
    )
}