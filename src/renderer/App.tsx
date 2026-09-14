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

  const [test, setTest] = useState("");

  const [oldPath, setOldPath] = useState("");
  const [newPath, setNewPath] = useState("");

  const [rules, setRules] = useState([]);


  const settingTest = async () => {
    await window.electron.moveTestingFile();

    return;
  }

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

      <Routes>
        
        <Route path="/" element={<Hello />} />
        <Route path="/create" element={<CreateNewRule/>}/>
        <Route path="/flowgraph" element={<Flowgraph/>}/>
      </Routes>
    </Router>
  );
}
