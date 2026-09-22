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



export default function App() {
  return (
    <Router>

      <div>

      <Routes>
        

        <Route path="/" element={
          <div className="h-dvh w-dvw flex flex-col from-surface-container to-surface-dim z-90">

            <Topbar/>

            <main className="flex-1 grow bg-primary-container w-full max-h-full">
              <Flowgraph/>
            </main>

            

          </div>
          
          }/>

        <Route path="/history" element = {
          <div className="h-dvh w-dvw flex flex-col bg-surface-container z-90">

            <Topbar/>

            <main className="flex-1 grow w-full max-h-full">
              <History/>
            </main>

            

          </div>
        }/>
      </Routes>

      </div>
    </Router>
  );
}
