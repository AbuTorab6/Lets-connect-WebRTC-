import React from 'react';
import {Routes,Route,BrowserRouter} from 'react-router-dom'

import HomePage from '../page/HomePage';
import JoinPage from '../page/JoinPage';

const MyRouter = () => {
    return (
        <div>
        <BrowserRouter>
                <Routes>
                    <Route path='/' element={<JoinPage/>}/>
                    <Route path='/join' element={<JoinPage/>}/>
                    <Route path='/home' element={<HomePage/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default MyRouter;