import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react';
import { Col, Container, Row, Navbar, Button, Spinner, Alert } from 'react-bootstrap';
import { Routes, Route, Outlet, Link, Navigate, useNavigate } from 'react-router';
import './App.css';

import { Layout } from './components/LayoutComponents.jsx';
import { DefaultRoute } from './components/DefaultRouteComponents.jsx';
import { ReservationRoute } from './components/ReservationRouteComponents.jsx';
import { LoginWithTotp } from './components/AuthComponents.jsx';

import API from './API.js';
import { LoginForm, TotpForm } from './components/AuthComponents.jsx';





function App() {
  // state moved up into App
  const [initialLoading, setInitialLoading] = useState(true);

  const [ dirty, setDirty ] = useState(true);

  const [ errorMsg, setErrorMsg ] = useState('');

  const [user, setUser ] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInTotp, setLoggedInTotp] = useState(false);

  function handleError(err) {
    console.log('handleError: ',err);
    let errMsg = 'Unkwnown error';
    if (err.errors) {
      if (err.errors[0].msg) {
        errMsg = err.errors[0].msg;
      }
    } else {
      if (err.error) {
        errMsg = err.error;
      }
    }
    setErrorMsg(errMsg);

    if (errMsg === 'Not authenticated')
      setTimeout(() => {  // do logout in the app state
        setUser(undefined); setLoggedIn(false); setDirty(true)
      }, 2000);
    else
      setTimeout(()=>setDirty(true), 2000);  // Fetch the current version from server, after a while
  }


  useEffect(()=> {
    const checkAuth = async() => {
      try {
        // here you have the user info, if already logged in
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
        if (user.isTotp)
          setLoggedInTotp(true);
      } catch(err) {
        // NO need to do anything: user is simply not yet authenticated
        //handleError(err);
      }
    };
    checkAuth();
  }, []);


  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(undefined);
    setLoggedInTotp(false);
    /* set app state (list of objects etc.) to empty if appropriate */
  }

  const loginSuccessful = (user) => {
    setUser(user);
    setLoggedIn(true);
    setDirty(true);  // load latest version of data, if appropriate
  }

  return (
    <Routes>
      <Route path='/' element={<Layout user={user} loggedIn={loggedIn} logout={doLogOut} loggedInTotp={loggedInTotp} />}>
          <Route index element={ <ReservationRoute /> } />
      </Route>
      <Route path='/login' element={ 
         <LoginWithTotp loginSuccessful={loginSuccessful} loggedIn={loggedIn} user={user} 
           loggedInTotp={loggedInTotp} setLoggedInTotp={setLoggedInTotp} />} />
      <Route path='/*' element={<DefaultRoute />} />
    </Routes>
  );
}



export default App
