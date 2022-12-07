import React, {useState} from 'react';
import {Routes, Route} from 'react-router-dom';
import { Inventory } from './components/Inventory';
import { Item } from './components/Item';
import { Login } from './components/Login';
import { Register } from './components/Register';
import UserContext from './context';
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{user, setUser}}>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/items' element={<Inventory/>}/>
        <Route path='/items/:id' element={<Item/>}/>
      </Routes>
    </UserContext.Provider>
    
  );
}

export default App;
