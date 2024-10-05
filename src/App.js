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
import GlobalContext from "./context/GlobalContext.js"
import { useAuthContext } from "./hooks/useAuthContext.js"

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

const App = () => {

  const { user } = useAuthContext();
  //TODO togli
  const debug = false;

  return (
    <>
    { /* TODO ovviamente da togliere*/ (user && debug) && <ul className="text-white">
      <li>id: {user?._id}</li>
      <li>fullName: {user?.fullName}</li>
      <li>username: {user?.username}</li>
      <li>email: {user?.email}</li>
      <li>picture: {user?.picture}</li>
      <li>bio: {user?.bio}</li>
      <li>token: {user?.token}</li>
      <li>created: {user?.createdAt}</li>
      <li>updated: {user?.updatedAt}</li>
    </ul>}
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
