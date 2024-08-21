import "@mobiscroll/react/dist/css/mobiscroll.scss";
import 'react-notifications-component/dist/theme.css';
import { Routes, Route, useNavigate } from "react-router-dom";
import { StartPage, MainPage, Login, Profile, Levels, Shop } from './components'
import { ReactNotifications } from 'react-notifications-component';
import { Notifications } from 'react-push-notification';
import 'animate.css/animate.min.css';
import 'animate.css/animate.compat.css'
import './App.css'

function App() {
  localStorage.TodayTime = Date.now();
  localStorage.TakeTime = Date.now();
  console.log("APP", localStorage.TodayTime, localStorage.TakeTime);

  return (
    <>
      {/* <ReactNotifications /> */}
      <Notifications />
      <Routes>
        <Route path='/' element={<StartPage/>}></Route>
        <Route path='/main' element={<MainPage/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path='/levels' element={<Levels/>}></Route>
        <Route path='/shop' element={<Shop/>}></Route>
      </Routes>
    </>
  )
}

export default App
