export default function TextButton(
    {text, clickFunction, wFull = false, color = " bg-primary-container "}: {
        text: string,
        clickFunction: () => any
        wFull?: boolean,
        color?: string

}) {

    return (
        <button
        onClick={() => {clickFunction()}}
        className={(wFull ? " w-full " : " ") + ` ${color} ` + " px-6 py-1  text-on-surface rounded-2xl shadow-xl/30 hover:scale-103 transition ease-in-out hover:cursor-pointer"}>
            {text}

        </button>
    )

}