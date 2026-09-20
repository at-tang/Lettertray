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



export default function App() {
  return (
    <Router>

      <div>

      <Routes>
        

        <Route path="/create" element={<CreateNewRule/>}/>
        <Route path="/" element={
          <div className="h-dvh w-dvw flex flex-col bg-surface-container z-90">

            <Topbar/>

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
