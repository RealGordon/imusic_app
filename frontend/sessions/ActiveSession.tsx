import * as React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { MessageBox2, SpinnerLoader } from '../General';
import {  getRDXPlaylists, playlistsObjectType } from '../playlists/playlistsSlice';
import { getRDXUser } from '../app/store';
import { getInterSessions,changeSessPrivacy, 
  getReduxSessions, saveSessionThunk, 
  sessionObjectType, joinSessThunk, 
  changeSessProps } from './sessionsSlice';
const validName=/\w{3,100}/
export const ActiveSession=(props:{id:string})=>{
    const { id} = props;
    const [loader,setLoader]=React.useState('idle')
    const [changeName,setChangeName]=React.useState({display:'hide',name:''})
    const dispatch= useAppDispatch()
    const navigate=useNavigate()
     //get sessions
    const sessions:sessionObjectType[]=useAppSelector(getReduxSessions)
    const user=useAppSelector(getRDXUser)
    const playlists=useAppSelector(getRDXPlaylists)
    const currentStatus=useAppSelector(s=>s.sessions.currentStatus)
    //get intermediate
  const intermediate=useAppSelector(getInterSessions)
 
   // const active_session=sessions.find((v)=>v.id===id)
    let currentplaylist=null,session:sessionObjectType;

    if(loader==='pending')return <SpinnerLoader  state={loader} />;
    //if new and intermediate use intermediate
if(id=='new' && intermediate){
 session=intermediate
}
//else find playllist using id
else {
  session=sessions.find(v=>v.id===id)
}
if(!session){
  return (<div className='w3-container w3-center'>
<h3>no active session</h3></div>);}
if(user.uid===session.owner){
currentplaylist=playlists.find((p:playlistsObjectType)=>{
  return   session.playlistId.some(v=>v===p.id)
})
 }

const playlists_tracks=<PlaylistTracks playlist={currentplaylist} />
  
  let { owner , img, name } = session;
  

  

const saveSession=(e:any)=>{
e.stopPropagation();
dispatch(saveSessionThunk({session:{...session}}))
}

const onPrivacySelect=(e:any)=>{
  e.stopPropagation();
 dispatch(changeSessProps({id,props:{privacy:e.target.value}}))
}
const onChangeName=(e:any)=>{
  dispatch(changeSessProps({id,props:{name:e.target.value}}))
}
 
const JoinSession=(e:any)=>{
e.stopPropagation()
//setLoader('pending')
dispatch(joinSessThunk({new_session:id}))
//setLoader('idle')
navigate('/static/imusic/player')
}
const onNameSave=(e:React.SyntheticEvent)=>{
e.stopPropagation()
const newName=document.getElementById('session-name').value;
if(!validName.test(newName))return setChangeName(s=>({...s,display:'hide'}));
dispatch( changeSessProps({id,props:{name:newName}}))
setChangeName(s=>({...s,display:'hide'}))
}
const nameInput=(
  <div className='w3-panel'>
 <h3>change title</h3>
 <input id='session-name' style={{width:"100%"}} className="w3-input"  
 defaultValue={name}></input></div>)
 const nameInputButtons=<button onClick={onNameSave} 
 className='w3-btn w3-blue'>Save</button>
 const onNameClick=(e:React.SyntheticEvent)=>{
e.stopPropagation();
setChangeName(s=>({...s,display:'show'}))
 }

 return (
    <>
    <div className="w3-row w3-margin">
      <div className="w3-container w3-col m8 w3-card-4 w3-white">
    {changeName.display==='show' && <MessageBox2  component={nameInput} 
     buttons={nameInputButtons}   display={changeName.display}  
     change={setChangeName} />}
      {/*<div className='w3-container'>
        <button onClick={goBack} className='w3-btn w3-black'>BACK</button>  </div>*/}
      <img src='/resources/images/jamming.jpg' 
      style={{ height:300,width:'90%'}} />
      <div className="w3-container">
        <h3><button onClick={onNameClick} data-sessionid={id} ><b>{name}</b></button></h3>
          <div className='w3-bar'>
      {  currentStatus=='new' && 
      <button className='w3-bar-item w3-btn w3-blue'  
      data-sessionid={id} 
       onClick={saveSession}>save</button>}
       {currentStatus && 
       <button className='w3-bar-item w3-button w3-round'>
        {currentStatus}</button>}
       </div>
       { currentStatus=='new' && 
      
        <fieldset className='w3-margin'>
    <legend>Privacy</legend>
       <select defaultValue="public"  onChange={onPrivacySelect}>
       <option  value="public" >Public</option>
       <option value="private" >Private</option>
     </select></fieldset>}
      </div>

      <div className="w3-container">
        {/*list of somgs */}
        
        <div className="w3-cell-row">
          <div className="w3-cell" style={{ float: 'left' }}>
            <div className='w3-bar'>
            {currentStatus!=='new' && <button data-sessionid={id} 
            className="w3-button w3-padding-large w3-blue w3-round "
            onClick={JoinSession}
            >
              Join session</button>}
              {/*<button className="w3-button w3-padding-large w3-white w3-border"
               ><b>Add more songs »</b></button>*/}</div>
          </div>
          {/*Github*/}
        </div>
        {playlists_tracks}
      </div>
      </div>
    </div></>
  )
}

const PlaylistTracks=(props:{playlist:playlistsObjectType})=>{
const{playlist}=props;
    if(playlist===null)return null;
/*const songs=playlist.songs.map((v,i)=>{
    return <div key={i}  className="w3-panel w3-sand w3-serif w3-leftbar">{v.title}</div>
})*/

const songs=playlist && playlist.songs.map((v,i)=>{
  return <tr  key={i}><td><h3>{v.name}</h3>
      <h5 className='w3-serif'>Album: {v.album.name}</h5>
      <h6><span>Artists: {
      v.artists.map(v=>v.name).join(" | ")}</span></h6>
      </td></tr>
})
    return <table className='w3-table-all w3-margin-top'>
  <thead><tr><th style={{width:"100%"}}>Songs</th></tr></thead>
  <tbody>{songs}</tbody>
    </table>
}