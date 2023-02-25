import * as React from 'react'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setOpenPlayerCount } from './playerSlice'
import { RootState } from '../app/store'
export const PlayerController=()=>{
    
    const openPlayerCount=useAppSelector((s:RootState)=>s.player.openPlayerCount)
    const dispatch=useAppDispatch()
    const songs=useAppSelector((s:RootState)=>s.player.songs)
    const songsLength=songs.length
    const currentSong=useAppSelector((s:RootState)=>s.player.currentSong)
    const  currentSessionId=useAppSelector((s:RootState)=>s.sessions.activeSession)
    const currentSession=(useAppSelector(s=>s.sessions.list)).find(v=>v.id===currentSessionId)
    const songStatus= useAppSelector(s=>s.player.songStatus)
   
    React.useEffect(()=>{
       if( !songsLength && openPlayerCount==='opened'){
        dispatch(setOpenPlayerCount('closed'))
       }   
    },[openPlayerCount])

  
const onClick=(e:React.SyntheticEvent)=>{
e.stopPropagation()
dispatch(setOpenPlayerCount(undefined))
}
  return  <div className='w3-main w3-center'>
    <div className='w3-container w3-margin'>
    <button   onClick={onClick} 
    className='w3-button w3-blue w3-large'>open player</button>
    </div>
  {(!songsLength )? (
    <h2 className='w3-margin'>No songs to play</h2>
  ) : null}
  {songsLength!==0 && currentSession && <>
  <h2 style={{fontFamily:'Verdana'}} 
  className='w3-container w3-margin song-name'>{currentSession.name}</h2>
  <div className='w3-container'>
  <img className='w3-round-xlarge' src={songs[currentSong].album.images[1].url}  
   width={300} height={300}  />
   </div>
   <p className='w3-large w3-padding'>{songsLength} songs</p>
   </>}
 
  </div>
}