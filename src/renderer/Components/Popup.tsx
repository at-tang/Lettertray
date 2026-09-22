import { ReactNode } from "react";

export default function Popup({value, setValue, children}: {value: boolean, setValue, children: ReactNode}) {

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            setValue(false);
        }
    }
    return (
        <>
        { value &&
            <div onClick={(e) => {handleBackgroundClick(e)}}  className="fixed top-0 left-0 bg-black/80 flex items-center justify-center z-110 w-dvw h-dvh">
                <div className="p-6 rounded-2xl bg-surface-container border-4 border-outline-b z-120 max-h-[90%] w-[80%] overflow-y-scroll scrollbar-thumb-primary-container">
                    {children}
                </div>
            </div>
        }
        </>
    )

}