import React,{useEffect,useState} from 'react';

import '../asset/css/custom.css'
import tune from '../asset/tune/tune.mp3'

import cogoToast from 'cogo-toast';
import ReactAudioPlayer from 'react-audio-player';

import { AiOutlineVideoCamera,AiOutlineMessage } from "react-icons/ai";
import {useNavigate} from 'react-router-dom'
import { IoIosCall } from "react-icons/io";

import { Peer } from "peerjs";

import io  from 'socket.io-client'
var socket = io.connect('/')






const Home = () => 
{
    const navigate = useNavigate();

    const[v1,v2]=useState([])
    const[peer,setPeer]=useState({})
    const[myPeer,setMyPeer]=useState("");
    const[receiverPartnerPeer,setReceiverPartnerPeer]=useState("");
    const[callerPartnerPeer,setCallerPartnerPeer]=useState("");


    const constraints = {
        'video':true,
        'audio':true
    }


    useEffect(()=>{
        if(!sessionStorage.getItem("name"))
        {
            navigate("/join");
        }

        const peer = new Peer();
        peer.on('open',(peerId)=>{
            //console.log(peerId)
            setMyPeer(peerId)

            addNewUser(peerId);
    
        })
        setPeer(peer)

    },[])



    

    var addNewUser = (peerId)=>
    {
        socket.emit('addNewUser',{name:sessionStorage.getItem("name"),peerId:peerId})
    }
    socket.on('announceNewUser',(data)=>{
        cogoToast.success(data.name+" joined")
    })
    socket.on('announceLeftUser',(data)=>{
        cogoToast.success(data.name+" left")
    })
    

    socket.on('userList',(data)=>{
         v2(data)
        //console.log(data)
    })

    

  
  


    v1.map(
            function(p1)
            {
                if(p1.peerId!==myPeer)
                {
                    var connObj = peer.connect(p1.peerId);
                    connObj.on('open',()=>{
                        console.log("connected with "+p1.name)
                        receiveCallInviteMsg();
                    })
                }                
            }
        )





        var makeCall = (partnerPeerId,myPeerId)=>
        {
            setCallerPartnerPeer(partnerPeerId);

            var connObj = peer.connect(partnerPeerId);
            var callerName = sessionStorage.getItem("name");
            connObj.on('open',(p1)=>{
                
                connObj.send([callerName+" is calling . . .",myPeerId])

                var modal = document.querySelector('.call-make-modal')
                modal.style.display = "block";
            })

            
        }
    
        var receiveCallInviteMsg = ()=>
        {
            peer.on('connection',(conn)=>{
                conn.on('data',(msg)=>{
                    

                    console.log(msg)

                    if(msg==="receiver rejected")
                    {
                        document.querySelector('.call-make-modal').style.display = "none";
                        
                    }
                    else if(msg==="caller rejected")
                    {
                        document.querySelector('.receive-modal').style.display = "none";
                    }
                    else if(msg[0]==="receiver received")
                    {
                        document.querySelector('.call-make-modal').style.display = "none";
                        document.querySelector('.receiver-modal-video').style.display = "block";

                        navigator.mediaDevices.getUserMedia(constraints).then
                        (
                            (stream)=>
                            {
                                //previewing own strema to video tag
                                var receiverStream = document.querySelector('.receiverStream');
                                receiverStream.srcObject=stream;
                                receiverStream.play();

                                //sending own stream to receiver
                                var CallerPartnerPeerId = msg[1]
                                var call = peer.call(CallerPartnerPeerId,stream)

                                //receiving call receiver's stream and previewing it to video tag
                                call.on('stream',(remoteStream)=>{
                                    var senderStream = document.querySelector('.senderStream');
                                    senderStream.srcObject=remoteStream;
                                    senderStream.play();
                                })

                            }
                        ).catch
                        (
                            (err)=>
                            {
                                alert(err);
                            }
                        )
                    }
                    else
                    {
                        var modal = document.querySelector('.receive-modal')
                        modal.style.display = "block";
                        document.querySelector('.modal-p').innerHTML=msg[0];

                        
                        setReceiverPartnerPeer(msg[1])
                    }

                })
            })
        }

        var rejectCallByReceiver = ()=>
        {

            document.querySelector('.receive-modal').style.display = "none";


            console.log(receiverPartnerPeer);
            var connObj = peer.connect(receiverPartnerPeer);
            connObj.on('open',(p1)=>{
                
                connObj.send("receiver rejected")
            })
        }

        var rejectCallByCaller = ()=>
        {

            document.querySelector('.call-make-modal').style.display = "none";


            console.log(receiverPartnerPeer);
            var connObj = peer.connect(callerPartnerPeer);
            connObj.on('open',(p1)=>{
                
                connObj.send("caller rejected")
            })
        }
        


       
        var receiveCall = ()=>
        {


            document.querySelector('.receive-modal').style.display = "none";
            document.querySelector('.receiver-modal-video').style.display = "block";
            
            var connObj = peer.connect(receiverPartnerPeer);
            connObj.on('open',(p1)=>{
                connObj.send(["receiver received",myPeer])
            })

            peer.on('call',(call)=>{
                navigator.mediaDevices.getUserMedia(constraints).then
                (
                    (stream)=>
                    {
                        //previewing own strema to video tag
                        var receiverStream = document.querySelector('.receiverStream');
                        receiverStream.srcObject=stream;
                        receiverStream.play();

                        //sending own stream to call maker
                        call.answer(stream);
                        
                        //receiving call maker stream and previewing it to video tag
                        call.on('stream',(remoteStream)=>{
                            var senderStream = document.querySelector('.senderStream');
                            senderStream.srcObject=remoteStream;
                            senderStream.play();
                        })
                    }
                ).catch
                (
                    (err)=>
                    {
                        alert(err);
                    }
                )
            })
        }




        var rejectDuringCall = ()=>
        {
            document.querySelector('.receiver-modal-video').style.display = "none";

            window.location.reload();
            
        }
    



   
    var newArr = v1.map(
        function(p1)
        {
            return(
                <div className='col'>
                    <h2 className='text-center mb-4'>{p1.name}</h2>
                    <p className='text-center'><button className='btn  btn-danger m-1 fs-4 ' onClick={makeCall.bind(this,p1.peerId,myPeer)}><AiOutlineVideoCamera/></button></p>
                    
                </div>
            )
        }
    )

    return (
        <div>
            <div className='home-section'>
                <div className='row'>
                    <div className='home-grid'>
                        {newArr}
                    </div>
                </div>
            </div>

            <div id="myModal" className="receive-modal">
                {/*  Modal content */}
                <div className="modal-content">
                    <div className="modal-header">
                        <span className="close">&times;</span>
                        <h2>Modal Header</h2>
                    </div>
                    <div className="modal-body">
                        <p className='modal-p'>Calling . . . </p>
                    </div>
                    <div className="modal-footer">
                            <button onClick={receiveCall}  className="btn btn-success receive">Receive</button>
                            <button onClick={rejectCallByReceiver} className="btn btn-danger reject">Reject</button>
                    </div>
                </div>
            </div>


            <div id="myModal" className="call-make-modal">
                {/*  Modal content */}
                <div className="modal-content">
                <div className="modal-header">
                    <span className="close">&times;</span>
                    <h2>Modal Header</h2>
                </div>
                <div className="modal-body">
                    <p className='modal-p'>Calling . . . </p>
                </div>
                <div className="modal-footer">
                    <button onClick={rejectCallByCaller} className="btn btn-danger reject">Reject</button>
                </div>
                </div>
            </div>

            <div id="myModal" className="receiver-modal-video">
                {/*  Modal content */}
                <div className="modal-content">
                    <div className="modal-body ">
                        <div className='receiver-modal-video-grid'>
                            <div className='col'>
                                <video src="" className="receiverStream w-100"></video>
                                <h1 className='receiverStream-h1'>Receiver stream</h1>
                            </div>
                            <div className='col'>
                                <video src="" className="senderStream w-100"></video>
                                <h1 className='senderStream-h1'>Sender stream</h1>
                            </div>
                        </div>
                        
                    </div>
                    <div className="modal-footer">
                        <button onClick={rejectDuringCall}  className="btn btn-danger reject">Reject</button>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Home;