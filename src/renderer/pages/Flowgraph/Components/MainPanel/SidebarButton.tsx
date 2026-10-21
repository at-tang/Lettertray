export default function SidebarButton({text, image, callback}: {text: string, image: string, callback: () => any}) {
    return (
            <button 
                onClick={() => {callback()}}
                className="flex flex-col items-center justify-center rounded-2xl hover:bg-primary-container hover:cursor-pointer hover:scale-102 transition ease-in-out text-white w-16 h-16 select-none">
                  <div className="flex items-center"><img className="mb-1 w-9 h-9" src={image}/></div>
                  <p className="text-xs">{text}</p>


            </button>

    )

}