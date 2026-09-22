export default function TopbarButton(
    {text, clickFunction}:
    {
        text: string,
        clickFunction: () => any
    }
) {
    return (
        <>
            <button 
            style={{"appRegion": "no-drag"}}
            onClick={() => {clickFunction()}}
            className="bg-surface-container-high border-outline-b border rounded-full px-4 text-sm hover:cursor-pointer hover:brightness-75 z-100">{text}</button>
        </>
    )
}