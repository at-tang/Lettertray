import { MemoryRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { useEffect, useState } from 'react';
import TextButton from './Components/TextButton';
import CreateNewRule from './pages/CreateRule/CreateNewRule';

import { Rule } from '../main/api/types';
import RuleList from './Components/RuleView/RuleList';
import Flowgraph from './pages/Flowgraph/Flowgraph';



export default function App() {
  return (
    <Router>

      <div>

      <Routes>
        

        <Route path="/create" element={<CreateNewRule/>}/>
        <Route path="/" element={
          <div className="h-dvh w-dvw flex flex-col bg-surface-container">

            <header className="w-full bg-surface-container-h h-7 flex items-center justify-center " style={{"appRegion": "drag"}}>


              <div className="flex-1 flex items-center gap-3 pl-3">

                <button onClick={() => {
                  console.log("Test!");

                  window.electron.closeApp();
                }
                  } className="w-4 h-4 bg-red-400 z-100 [webkit-app-region: no-drag] rounded-full hover:brightness-95" style={{"appRegion": "no-drag"}}>

                </button>

                <button onClick={() => {
                  console.log("Test!");

                  window.electron.minimizeApp();
                }
                  } className="w-4 h-4 bg-yellow-400 z-100 [webkit-app-region: no-drag] rounded-full hover:brightness-95" style={{"appRegion": "no-drag"}}>

                </button>
              </div>

              <p className="text-sm">Lettertray (Beta Version)</p>

              <div className="flex-1">

              </div>
              

            </header>
            

            <main className="flex-1 grow bg-primary-container w-full max-h-full">
              <Flowgraph/>
            </main>

            

          </div>
          
          }/>
      </Routes>

      </div>
    </Router>
  );
}
