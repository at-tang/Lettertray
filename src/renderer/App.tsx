import { MemoryRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { useEffect, useState } from 'react';
import TextButton from './Components/TextButton';
import CreateNewRule from './pages/CreateRule/CreateNewRule';
import React from 'react';

import { Rule } from '../main/api/types';
import RuleList from './Components/RuleView/RuleList';
import Flowgraph from './pages/Flowgraph/Flowgraph';
import Topbar from './Components/Topbar/Topbar';
import History from './pages/History/History';
import Conflict from './pages/Conflict/conflict';
import image from 'assets/appIcons/folder.png'



export default function App() {

  const handleAddClick = async () => {
    const originPath = await window.electron.selectFolder();
    if (!originPath) return;

    const folderName = originPath.split(/[\\/]/).pop() ?? originPath;

    const flowgraph = await window.electron.loadFlowgraph();
    const nodes = flowgraph.nodes;

    const newId: number = await window.electron.generateId();

    let x = 0; let y = 0;
    let overlapping = true;
    while (overlapping) {
      overlapping = false;
      for (const node of nodes) {
        if (node.position.x === x && node.position.y === y) {
          x += 50;
          y += 50;
          overlapping = true;
          break;
        }
        
      }
    }

    const newNode = {
                id: newId.toString(),
                position: {x: x, y: y},
                data: {value: originPath, label: folderName},
                type: "customNode"
            }
    await window.electron.saveFlowgraph({nodes: [...nodes, newNode], edges: flowgraph.edges})
    window.location.reload();

  }


  return (
    <Router>

      <div>

      <Routes>
        

        <Route path="/" element={
          <div className="h-dvh w-dvw flex flex-col from-surface-container to-surface-dim z-90">
            <Topbar/>

            <main className="flex-1 grow bg-primary-container w-full h-full flex items-center justify-center">

              <Flowgraph/>
            </main>
          </div> 
          }/>

        <Route path="/history" element = {
          <div className="h-dvh w-dvw flex flex-col bg-surface-container z-90">

            <Topbar/>

            <main className="flex-1 grow w-full min-h-0">
              <History/>
            </main>

            

          </div>
        }/>

        <Route path="/conflict" element = {
          <div className="h-dvh w-dvw flex flex-col from-surface-container to-surface-dim z-90">
            <Topbar/>

            <main className="min-h-0 flex-1 grow bg-primary-container w-full">
              <Conflict/>
            </main>
          </div> 
        }/>
      </Routes>

      </div>
    </Router>
  );
}
