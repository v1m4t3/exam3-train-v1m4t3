import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react';
import { Col, Container, Row, Navbar, Button, Spinner, Alert } from 'react-bootstrap';
import { Routes, Route, Outlet, Link, Navigate, useNavigate } from 'react-router';

import { Layout } from './components/LayoutComponents.jsx';
import { DefaultRoute } from './components/DefaultRouteComponents.jsx';
import { TrainsRoute } from './components/TrainsRouteComponents.jsx';
import { ReservationsRoute } from './components/ReservationsRouteComponents.jsx';
import { LoginWithTotp } from './components/AuthComponents.jsx';

import API from './API/AuthenticationAPI.js';
import TrainAPI from './API/TrainAPI.js';
import { LoginForm, TotpForm } from './components/AuthComponents.jsx';
import { use } from 'react';
import './App.css';




function App() {
  const [trains, setTrains] = useState([]);
  // state moved up into App
  const [initialLoading, setInitialLoading] = useState(true);

  const [ dirty, setDirty ] = useState(true);

  const [ errorMsg, setErrorMsg ] = useState('');

  const [user, setUser ] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInTotp, setLoggedInTotp] = useState(false);
  
  const navigate = useNavigate();

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
// ***** Train functions *****
  useEffect(() => {

    TrainAPI.getAllTrains()
        .then(fetchedTrains => {
            setTrains(fetchedTrains);
            setInitialLoading(false);
            setDirty(false);
        })
        .catch(err => {
            console.error("Error fetching trains:", err);
        });
  }, []);


// ***** Authentication functions *****
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
          <Route index element={ 
              <TrainsRoute loggedIn={loggedIn} listOfTrains={trains}
                            initialLoading={initialLoading} 
                            errorMsg={errorMsg} setErrorMsg={setErrorMsg}  /> } />
          <Route path='/my-reservations' element={ loggedIn ?
              <ReservationsRoute user={user} loggedIn={loggedIn} loggedInTotp={loggedInTotp} 
                                listOfTrains={trains}
                                initialLoading={initialLoading} errorMsg={errorMsg} setErrorMsg={setErrorMsg}  /> :
                          <Navigate to='/' replace /> } />
      </Route>
    
      <Route path='/login' element={ 
         <LoginWithTotp loginSuccessful={loginSuccessful} loggedIn={loggedIn} user={user} 
           loggedInTotp={loggedInTotp} setLoggedInTotp={setLoggedInTotp} />} />
      <Route path='/*' element={<DefaultRoute />} />
    </Routes>
  );
}



export default App
