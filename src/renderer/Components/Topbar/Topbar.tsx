export default function Topbar() {

    return (
        <header className="w-full bg-surface-container-h flex items-center justify-center border-b-outline-b border-b-3 py-1 rounded-xl" style={{"appRegion": "drag"}}>


              <div className="flex-1 flex items-center gap-3 pl-3">

                <button onClick={() => {
                  console.log("Test!");

                  window.electron.setToBackground();
                }
                  } className="w-4 h-4 bg-red-400 z-100 [webkit-app-region: no-drag] rounded-full hover:brightness-90" style={{"appRegion": "no-drag"}}>

                </button>

                <button onClick={() => {
                  console.log("Test!");

                  window.electron.minimizeApp();
                }
                  } className="w-4 h-4 bg-yellow-400 z-100 [webkit-app-region: no-drag] rounded-full hover:brightness-90" style={{"appRegion": "no-drag"}}>

                </button>
              </div>

              <p className="text-md ">Lettertray (Beta Version)</p>

              <div className="flex-1">

              </div>
              

            </header>
    )
}