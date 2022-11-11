import React,{Fragment,useState } from 'react';

import {useNavigate} from 'react-router-dom'
import cogoToast from 'cogo-toast';
import { Peer } from "peerjs";
import '../asset/css/custom.css'

import io  from 'socket.io-client'
var socket = io.connect('/')

const JoinForm = () => 
{

    const navigate = useNavigate();
    

    var joinFunc = (p1)=>
    {
        var joinName = document.querySelector('.joinName').value;
       
        if(joinName.length==0)
        {
            cogoToast.error("Please Provide name");
        }
        else
        {
            sessionStorage.setItem("name",joinName);
            navigate("/home");
        }

    }

    return (
        <Fragment>
            <section className='join-section'>
                <div className='row'>
                    <div className='form'>
                        <form>
                            <h5>Join Meeting</h5>
                            <div>
                                <input className='joinName' type="text" placeholder="Enter your name"/>
                            </div>
                            
                        </form>

                        <div>
                            <button  onClick={joinFunc} className='next-btn'>Join</button>
                        </div>
                        
                    </div>
                </div>
            </section>
        </Fragment>
    );
};

export default JoinForm;