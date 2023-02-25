import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Player } from '../player/Amplitude';
//import {Nav} from './navigation/Navigation.js';

export default function App({user}){
      const navigate=  useNavigate()
      
useEffect(()=>{
if(!user)return
if(!location.search)return;
if(location.pathname.indexOf('index.html')===-1)return;
navigate('/static/imusic/sessions'+location.search)
},[user])


return (    <>
            <Player  />
            <div>  
             <Outlet context={[user]}/>
            </div></>)
}