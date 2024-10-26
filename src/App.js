/* [TODO]

- Modelli:
  > vorrei mostrare gli errori dei validators, ma sembra essere complicato aaaaaaa
- themes fatti come dice Asia
- calendario
  > modal più piccolo
- home 
  > navbar (quasi finita)
  > renderla carino da vedere
- profile
  > rifinire

*/
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import InitialPage from "./components/InitialPage.js"
import Header from "./components/Header.js"
import Home from "./components/Home.js";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import Profile from "./components/Profile.js";
import Calendar from "./components/Calendar";

import Prova from "./components/Prova.js"

// Imposta la lingua della data in italiano
import dayjs from "dayjs"
import "dayjs/locale/it"
dayjs.locale("it");
dayjs.extend(require("dayjs/plugin/objectSupport"))

const App = () => {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<><InitialPage/></>}/>
        <Route path="/home" element={<><Header/><Home/></>}/>
        
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/profile" element={<Profile />}/>

        <Route path="/calendar" element={<Calendar/>}/>
        <Route path="/notes" element={<></>} />
        <Route path="/pomodoro" element={<></>}/>

        <Route path="/prova" element={<Prova/>}/>
      </Routes>
    </Router>
    </>
  );
};

export default App;
