export default function TextButton(
    {text, clickFunction}: {
        text: string,
        clickFunction: () => any

}) {

    return (
        <button
        onClick={() => {clickFunction()}}
        className="px-6 py-1 bg-on-surface text-primary-container rounded-2xl shadow-xl/50
        hover:scale-105 hover:brightness-90 transition ease-in-out hover:cursor-pointer">
            {text}

        </button>
    )

}