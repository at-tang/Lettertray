export default function TextButton(
    {text, clickFunction, wFull = false}: {
        text: string,
        clickFunction: () => any
        wFull?: boolean

}) {

    return (
        <button
        onClick={() => {clickFunction()}}
        className={(wFull ? " w-full " : " ") + "px-6 py-1 bg-primary-container text-on-surface rounded-2xl shadow-xl/30 hover:scale-103 transition ease-in-out hover:cursor-pointer"}>
            {text}

        </button>
    )

}