import * as React from 'react'
import Spotify from '../spotify/Spotify'
import { changePlayerSongTrack, getPlayerSongStatus } from './playerSlice'
import { useAppDispatch, useAppSelector} from "../app/hooks";
import { changeSongStatus, addPlayerTracks } from './playerSlice';
export const Player=()=>{
  const uris=useAppSelector(s=>s.player.uris)
  const  currentSessionId=useAppSelector(s=>s.sessions.activeSession)
  const currentSession=(useAppSelector(s=>s.sessions.list)).find(v=>v.id===currentSessionId)
  const songStatus= useAppSelector(s=>s.player.songStatus)
  const dispatch=useAppDispatch()
  const currentSong=useAppSelector(s=>s.player.currentSong)


  React.useEffect(()=>{
if(!uris)return;
dispatch( addPlayerTracks())
  },[uris])
const Play=(e:any)=>{
e.stopPropagation();
dispatch(changeSongStatus({state:'play'}))
}
const Pause=(e:any)=>{
    e.stopPropagation();
    dispatch(changePlayerSongTrack('pause'))
   
    }
const onPlayPause=songStatus==='pause'?Play:Pause;
const Next=(e:any)=>{
    e.stopPropagation();
   dispatch(changePlayerSongTrack ('next'))
    }
    const Previous=(e:any)=>{
        e.stopPropagation();
      dispatch(changePlayerSongTrack('previous'))
        }
      const currentSource=uris? uris[currentSong]:'';
return <div style={{marginLeft:300}} className='w3-main w3-col m6 w3-container w3-margin' 
>
<div className='w3-container w3-margin'>
  <p>Session name: {currentSession? currentSession.name:null}</p>
  <p>Privacy: {currentSession? currentSession.privacy:null}</p>
</div>
<div className='w3-cell-row w3-col m5'>
        <audio controls data-num={currentSong}>
          <source  src={currentSource} type='audio/mp3' />
        </audio>
    <div className='w3-cell w3-margin'>
    <button  className='w3-btn w3-blue' onClick={Previous} >Previous</button></div>
    {/*<div className='w3-cell w3-margin'>
    <button  className='w3-btn' onClick={onPlayPause}  >
     {(songStatus==='pause'||songStatus==='idle')?'Play':'Pause'}
     </button></div>*/}
    <div className='w3-cell w3-margin'>
    <button className='w3-btn w3-blue' onClick={Next} >
      Next</button></div>
</div>
</div>


}