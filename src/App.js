/* TODO

- Modelli:
  > vorrei mostrare gli errori dei validators, ma sembra essere complicato aaaaaaa
- dark theme fatto bene (con dark:) c'è molto da fare
- calendario
  > modal più piccolo
  > backend (mannaggia al backed)
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

// Imposta la lingua della data in italiano
import dayjs from "dayjs"
import "dayjs/locale/it"
dayjs.locale("it");

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
      </Routes>
    </Router>
    </>
  );
};

export default App;
