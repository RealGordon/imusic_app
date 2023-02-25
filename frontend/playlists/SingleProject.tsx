import React,{useState,useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';

import { MessageBox2 } from '../General';
import { SongsSearch } from '../search/Search';
import { changeCurrentSess } from '../sessions/sessionsSlice';
import { changePlaylistProps, getInterPlaylist, playlistsSelector, removePlaylistSong, savePlaylistThunk } from './playlistsSlice';



const validName=/\w{3,60}/;
export const SingleProject = (props:any) => {
  const [changeName,setChangeName]=useState({display:'hide'})
  const [searchSongs,setSearchSongs]=useState(false)
  let playlist:any;
  const { id, setView, category } = props;
  const currentStatus=useAppSelector(s=>s.playlists.currentStatus)
  const dispatch=useAppDispatch()
  const navigate=useNavigate()
  const user=useAppSelector(s=>s.user.user)
//get playlists
const list=useSelector(playlistsSelector)
//get intermediate
const intermediate=useSelector(getInterPlaylist)
//if new and intermediate use intermediate
if(id=='new' && intermediate){
  playlist=intermediate
}
//else find playllist using id
else {
  //playlist=list.find(v=>v.id===id)
  playlist=intermediate
}
  if(!playlist)playlist={};
  
  let { link, img, name, des, long_des, type, songs,sessions  } = playlist;
  
  const PlaylistTracks=(props:any)=>{

    const {playlist ,dispatch}=props; 
    const user=useAppSelector(s=>s.user.user)
    const {songs,sessions}=playlist;
    const removeSong=(e:any)=>{
      e.stopPropagation();
      dispatch(removePlaylistSong(e.target.dataset.uri))
      
       } 
if (songs.length===0)return null;
const content=songs.map((v:any,i:number)=>{
  return <tr  key={i}><td><h3>{v.name}</h3>
        
        <h5 className='w3-serif'>Album {v.album.name}</h5>
        <span>Artists: {v.artists.map((v:any)=>v.name).join(" | ")}</span>
        
        </td><td><button onClick={removeSong} data-uri={v.uri} >Remove</button></td></tr>
})

return <table className='w3-table-all w3-margin-top'>
<thead><tr><th style={{width:"85%"}}>Songs</th><th style={{width:"15%"}}></th></tr></thead>
<tbody>{content}</tbody>
</table>
  }

  
  const onNameSave=(e:React.SyntheticEvent)=>{
    e.stopPropagation()
    const newName=document.getElementById('playlist-name').value;
    if(!validName.test(newName))return setChangeName(s=>({...s,display:'hide'}));
    dispatch( changePlaylistProps({id,props:{name:newName}}))
    setChangeName(s=>({...s,display:'hide'}))
    }
 const nameInput=(
  <div className='w3-panel'>
 <h3>change title</h3>
 <input id='playlist-name' style={{width:"100%"}} className="w3-input"  
 defaultValue={name}></input></div>)
 const nameInputButtons=<button onClick={onNameSave}
 className='w3-btn w3-blue'>Save</button>
 const addMoreSongs=(e:any)=>{
  e.stopPropagation()
  setSearchSongs(true)
 }
 
 const savePlaylist=(e:any)=>{
e.stopPropagation();
dispatch(savePlaylistThunk({playlist:{...playlist}}))
/*if(id==='new'){
  navigate('/static/imusic/sessions')
}*/
 }
const onCreateSession=(e:any)=>{
e.stopPropagation();
const data={playlist:e.target.dataset.playlistid,id:'new',
user
}
dispatch(changeCurrentSess(data))
navigate('/static/imusic/sessions')
}
const onNameClick=(e:React.SyntheticEvent)=>{
  e.stopPropagation();
  setChangeName(s=>({...s,display:'show'}))
   }
  return (
    <>
    {changeName.display==='show' && (
    <MessageBox2 title="Edit" component={nameInput} 
    buttons={nameInputButtons} 
    display={changeName.display}
    change={setChangeName}
    />)}
    <div className="w3-row w3-margin">
      <div className="w3-container w3-col m8 w3-card-4 w3-white">
 <div className='w3-display-container'>
      <img src='/resources/images/jamming.jpg' 
      style={{ height:300,width:'100%' }} />
{currentStatus && 
<span className='w3-display-bottomright w3-light-grey w3-padding w3-round-xxlarge w3-small'>{currentStatus}</span>}
      </div>
      <div className="w3-container">
        <h3><button data-playlistid={id} 
        onClick={onNameClick}><b>{name}</b></button></h3>
      <div className='w3-bar'>
      {songs.length!==0 && (currentStatus=='edited' ||
      currentStatus=='not saved')  && (
<button className='w3-bar-item w3-btn w3-blue w3-round-xxlarge w3-margin'  data-playlistid={id} 
       onClick={savePlaylist}>save</button>)}
       {id!=='new' && (!sessions||!sessions.length)  &&
       <button data-playlistid={id} 
       onClick={onCreateSession} 
className='w3-bar-item w3-btn  w3-blue w3-margin w3-round-xxlarge'>
        create session</button>}
  <button 
className="w3-bar-item w3-btn w3-white w3-border w3-margin w3-round-xxlarge"
      onClick={addMoreSongs} ><b>Add more songs »</b></button>
       </div>
      </div>

      <div className="w3-container">
        {/*list of somgs */}
        <PlaylistTracks dispatch={dispatch}  playlist={playlist}  />
     
        { <SongsSearch /> }
      </div>
      </div>
    </div></>
  )
}
