import { MemoryRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { useEffect, useState } from 'react';
import TextButton from './Components/TextButton';
import CreateNewRule from './pages/CreateRule/CreateNewRule';

import { Rule } from '../main/api/types';
import RuleList from './Components/RuleView/RuleList';


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

  
  return (
    <div className="p-4">
      <h1 className=" text-4xl">{test}</h1>
      <button className="bg-gray-500 rounded-2xl text-white hover:cursor-pointer hover:brightness-75 px-8 py-2" onClick={() => {settingTest()}}>
        Test
      </button>

      <h1>Test!</h1>
      <TextButton clickFunction={() => {navigate("/create")}} text="Testing!"/>

      <TextButton text="Clear All Rules" clickFunction={async () => {await window.electron.clearAllRules()}}/>

      <RuleList rules={rules}/>



      </div>
  );
}

export default function App() {
  return (
    <Router>

      <Routes>
        
        <Route path="/" element={<Hello />} />
        <Route path="/create" element={<CreateNewRule/>}/>
      </Routes>
    </Router>
  );
}
