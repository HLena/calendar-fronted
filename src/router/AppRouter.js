import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import { LoginScreen } from '../components/auth/LoginScreen';
import CalendarScreen from '../components/calendar/CalendarScreen';


const AppRouter = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path = "/login" element = { <LoginScreen/>}/>
          <Route exact path = "/" element = { <CalendarScreen/>}/>

        </Routes>
      </div>
    </Router>
  )
}

export default AppRouter