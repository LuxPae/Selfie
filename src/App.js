import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import InitialPage from "./components/InitialPage.js"
import Header from "./components/Header.js"
import Home from "./components/Home.js";
import HomeJS from "./components/HomeJS.js";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import Profile from "./components/Profile.js";
import Calendar from "./components/Calendar";

import Notes from "./components/Notes.js"
import Pomodoro from "./components/Pomodoro.js"

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
        <Route path="/home" element={<Home/>}/>
        <Route path="/homejs" element={<><Header/><HomeJS/></>}/>
        
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/profile" element={<Profile />}/>

        <Route path="/calendar" element={<Calendar/>}/>
        <Route path="/notes" element={<Notes/>} />
        <Route path="/pomodoro" element={<Pomodoro/>}/>

        <Route path="/prova" element={<Prova/>}/>
      </Routes>
    </Router>
    </>
  );
};

export default App;
