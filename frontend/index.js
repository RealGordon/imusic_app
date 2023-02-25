import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import App from './app/App.js';
import { Player } from './player/Amplitude';
//import { initApp } from './user_listener.js';
import { MessageBox3, SpinnerLoader } from './General.js';
import { BrowserRouter as Router, Routes,Route, Navigate, useNavigate} from 'react-router-dom';
//import { Home } from './Home.js';
import {Nav} from './navigation/Navigation';
import { Sessions } from './sessions/Sessions';
import { Playlists } from './playlists/playlists';
//import { Friends } from './friends/Friends.js';
import store from './app/store';
import { setUser } from './user/userSlice';
import { Provider, useDispatch } from 'react-redux';
import { getplaylists } from './playlists/firestore.js';
import { getPlaylists, playlistsAdded } from './playlists/playlistsSlice';
import { getSessions,getLiveSessions } from './sessions/sessionsSlice';
import { useAppSelector } from './app/hooks';
//import {AddPlayerListeners, initPlayer} from './player/init_player'
import Spotify from './spotify/Spotify'
import {FriendSearch} from './messages/SearchFriends'
import {Chat} from './messages/Chat'
import { listenMessages } from './messages/firestore';
import { getMessages } from './messages/friendsSlice';

import { ListenToSessions} from './sessions/firestore'
import { PlayerController } from './player/playercontroller';
window.setUser=setUser;
window.store=store;
window.RDXdispatch=store.dispatch;

const menu_items=[['/static/imusic/index.html','Home'],
["/static/imusic/sessions","Session"],
["/static/imusic/playlists","Playlists"],
['/static/imusic/search/friends','Friends'],
['/static/imusic/player','Player'],
['/static/imusic/chat','Chat']
];
const MainApp=()=>{
const [user,setAppUser]=useState({user:null,state:'pending',action:'fetch',
redirect:(location.search!=='')
})
const initPlayerCommand=useAppSelector(s=>s.player.PlayerCommand)
const playerStatus= useAppSelector(s=>s.player.status)
const dispatch=useDispatch()
  const reduxUser=useAppSelector(s=>s.user)
  
  useEffect(()=>{
//if(window.accessToken)return;
//window.accessToken=undefined;
if(!reduxUser.user)return;
//Spotify.getAccessToken()
Spotify.getspotToken()
  },[reduxUser.user])
  useEffect(()=>{
    if(!reduxUser.user)return;
    if(reduxUser.user && !reduxUser.user.uid)return;
    //unregistered user
    if(!reduxUser.user.email)return;
    console.log('about to listen to messages')
  
   return listenMessages(reduxUser.user.uid,dispatch,getMessages)
  },[reduxUser.user])
  useEffect(()=>{
    if(!reduxUser.user)return;
    if(reduxUser.user && !reduxUser.user.uid)return;
    console.log('about to listen to live sessions')
   return ListenToSessions(dispatch,getLiveSessions)
  },[reduxUser.user])
  useEffect(()=>{
    if(initPlayerCommand!=='turn-on')return;
    if(playerStatus==='ready')return;
//dispatch(initPlayer('pending'))
//AddPlayerListeners(dispatch)
  },[initPlayerCommand])
  useEffect(()=>{
const getUser=async ()=>{ 
  const currentUser= firebase.auth().currentUser
  const {uid,email,displayName}=currentUser?currentUser:{};
  
    setUser(s=>({...s,action:'ff',state:((!currentUser && !s.redirect)?'query':'ff'),
user:currentUser?{uid,email,displayName}:null
    }))
    
  
 //initApp(setUser)
  }
 
  if(reduxUser.action=='fetch'){ 
  //getUser()
  }
  },[reduxUser.action])
//if(!user.user && user.state=='pending' ) return <SpinnerLoader state={user.state} />;
//if(!user.user){
 //   location="/static/signin.html";
  //  return null;
//}
//get sessions

useEffect(()=>{
  if(reduxUser.user==null)return;
  const getDataList=async ()=>{
  
  dispatch(getSessions(reduxUser.user.uid))
  }
  getDataList()
    },[reduxUser.user])

//get playlists
useEffect(()=>{
  if(reduxUser.user==null)return;
  const getDataList=async ()=>{
  dispatch(getPlaylists(reduxUser.user.uid))
  }
  getDataList()
    },[reduxUser.user])


if(reduxUser.state==='query' && (!reduxUser.user)){
  return <MessageBox3  dispatch={store.dispatch} change={setUser} />
}

if(reduxUser.state==='pending'){
  return <SpinnerLoader  state={reduxUser.state}/>
}



return (<Router>
    <Nav   user={reduxUser.user} menu_items={menu_items} />
    <Routes>
    <Route path="/static/imusic" element={<App  user={reduxUser.user}/>}   >
      <Route path='index.html' element={<Sessions/>} />  
      <Route path='player' element={<PlayerController />} />
      <Route path='sessions' element={<Sessions />} />
        {reduxUser.user && <>
        <Route path='playlists' element={<Playlists />} />
        <Route path='search/friends' element={<FriendSearch />} />
        <Route path='chat' element={<Chat />} />
        </>
        }
      
    </Route>
    </Routes>
</Router>
);
}

ReactDOM.render(<Provider store={store}> 
<MainApp   />
</Provider>
,document.getElementById('main-container'))


