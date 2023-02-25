import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { MessageBox2 } from '../General';
import { initPlayer } from '../player/playerSlice';
import { LeaveSession } from './firestore';

import {  leaveSessThunk, sessionObjectType } from './sessionsSlice';
import { joinSessThunk } from './sessionsSlice';

export const ProjectCard=(props:{session:sessionObjectType})=>{
  const dispatch= useAppDispatch()
  const  user=useAppSelector(s=>s.user.user)
  const [share,setShare]=React.useState({display:'hide'})
  const activeSession=useAppSelector(s=>s.sessions.activeSession)
  const playlists=useAppSelector(s=>s.playlists.list)
  //const {first,category}=props;
  const {id, img , owner,name ,participants,activeStatus,privacy,playlistId} = props.session;

//get playlist from playlistd
const fplaylist=playlists.find(p=>p.id===playlistId[0])

const sessionImage=fplaylist && fplaylist.songs[0].album.images[1].url
  const onJoinClick=(e:React.SyntheticEvent)=>{
  e.stopPropagation()
//dispatch(initPlayer('turn-on'))
dispatch(joinSessThunk({new_session: id}))
}
const onLeaveClick=(e:React.SyntheticEvent)=>{
  e.stopPropagation()
  
  dispatch(leaveSessThunk({old_session: id}))
}
const onShareClick=(e:React.SyntheticEvent)=>{
e.stopPropagation();
setShare(s=>({...s,display:'show'}))
}
return (<>
    <MessageBox2 display={share.display}  title='Share' 
    message={'https://amalitech-node-project.el.r.appspot.com'+
    '/static/imusic/index.html'+
    `?privacy=${privacy}&session=${id}`}  
    change={setShare}   />
    <div 
    style={{height:450,overflow:'hidden',padding:0}}
className="w3-col m3 w3-container w3-animate-left w3-round-xlarge w3-border w3-card w3-margin w3-white">
    <div className='w3-display-container' style={{height:170}} >
    <img style={{width:'100%'}} 
    src={sessionImage?sessionImage:"/resources/images/sessions_mic.jpg"  }
    className="w3-hover-opacity" height={170} />
     {activeSession==id? <button 
     className='w3-padding w3-display-bottomright w3-small  w3-blue w3-round-xxlarge'
>Joined</button>:null}
    </div>
     <div className='w3-bar w3-margin-top w3-padding'>
      {owner === user.uid ?<button  onClick={onShareClick}
     className='w3-bar-item w3-btn w3-blue w3-round-xlarge w3-margin-right'>
      Share</button>:null}
     {activeSession!==id?<button onClick={onJoinClick}  
     className='w3-bar-item w3-btn w3-blue w3-round-xlarge'>Join</button>:
     <button onClick={onLeaveClick}  
     className='w3-bar-item w3-btn w3-blue w3-round-xlarge'>Leave</button>
     }
    
     </div>
    <div className="w3-container w3-padding">
      <p><a  href="#"><b>{name}</b></a></p>
      {fplaylist && owner===user.uid && <p>playlist name: {fplaylist.name}</p>}
      {owner === user.uid ?<p>Owner: You</p>:null}
      {(participants!=null && participants!=0) && <p>Participants:{(participants?participants:'0')+' members'}</p>}
      <p>Privacy: {privacy}</p>
      {/*<p>Status:{activeStatus?'on-going':"empty"}</p>*/}
     
    </div>
  </div>
</>
)

}