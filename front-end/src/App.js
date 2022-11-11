import React,{Fragment,useEffect} from 'react';
import io  from 'socket.io-client'
import {BrowserRouter} from 'react-router-dom'


import Navigation from './components/Navigation';
import JoinForm from './components/JoinForm';

import MyRouter from './router/MyRouter';

const App = () => 
{

  

  return (
    <Fragment>
        <MyRouter/>
    </Fragment>
  );
};

export default App;