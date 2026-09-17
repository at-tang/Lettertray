import { MemoryRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { useEffect, useState } from 'react';
import TextButton from './Components/TextButton';
import CreateNewRule from './pages/CreateRule/CreateNewRule';

import { Rule } from '../main/api/types';
import RuleList from './Components/RuleView/RuleList';
import Flowgraph from './pages/Flowgraph/Flowgraph';


function Hello() {

  const navigate = useNavigate();

  const [rules, setRules] = useState([]);


  useEffect(() => {
    const getRules = async () => {
      const result = await window.electron.getRules();
      setRules(result);
      
    }
    getRules();

  }, [])

  useEffect(() => {console.log(rules)}, [rules])

  //      <RuleList rules={rules} setRules={setRules}/>
  return (
    <div className="p-4">

      <TextButton clickFunction={() => {navigate("/create")}} text="Add Rule"/>
        <TextButton clickFunction={() => {navigate("/flowgraph")}} text="Flowgraph"/>

      <TextButton text="Clear All Rules" clickFunction={async () => {await window.electron.clearAllRules()}}/>

        <RuleList rules={rules} setRules={setRules}/>





      </div>
  );
}

export default function App() {
  return (
    <Router>

      <div>

      <Routes>
        

        <Route path="/create" element={<CreateNewRule/>}/>
        <Route path="/" element={
          <div className="h-dvh w-dvw flex flex-col bg-surface-container">

            <header className="w-full bg-surface-container-h h-7 flex items-center justify-center" style={{"appRegion": "drag"}}>
              <p className="text-sm">Lettertray (Beta Version)</p>

            </header>
            

            <div className="flex-1 grow bg-primary-container w-full max-h-full">
              <Flowgraph/>

            </div>

            

          </div>
          
          }/>
      </Routes>

      </div>
    </Router>
  );
}
