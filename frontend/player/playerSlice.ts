import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import {RootState} from '../app/store'
import { getSessionPlaylist, joinSessThunk, leaveSessThunk } from "../sessions/sessionsSlice";
import Spotify from '../spotify/Spotify'
import {playlistsObjectType } from "../playlists/playlistsSlice";
interface playerSliceInterface {
  message:string,
  status:'offline'|'ready',
  device_id:string ,
  songStatus:'idle'|'pause'|'play',
  apiLoading:'idle'|'pending'|'ff'|'rejected',
  PlayerCommand:'off'|'turn-on'|'pending',
  songs:any[],
  changedTracks:number,
  currentSong:number|null,
  openPlayerCount:'opened'|'closed',
  currentSession:string|null
}
const initialState:playerSliceInterface={
  message:'',
  status:'offline',
  device_id:'' ,
  songStatus:'idle',
  apiLoading:'idle',
  PlayerCommand:'off',
  currentSession:null,
  songs:[],
  changedTracks:0,
  currentSong:0,
  openPlayerCount:'closed'
}
const slice=createSlice({
    name:'player',
  initialState,
    reducers:{
      changePlayerStatus(s,a){
        return {...s,...a.payload}
      },changePlayerSongTrack(s,a){
         
         if(typeof a.payload  == 'number'){
          s.currentSong=a.payload
         }
         else { 
          switch(a.payload){
          case 'next':{
            if(s.currentSong!==(s.songs.length-1)){
            s.currentSong=s.currentSong+1
          }
            break;}
          case 'previous':{
              if(s.currentSong!==0){
                s.currentSong=s.currentSong-1}
                break;
              }

         }
        }
      },setOpenPlayerCount(s,a){
        if(a.payload)s.openPlayerCount=a.payload;
        else s.openPlayerCount='opened'
      },
      initPlayer(s,a){
        s.PlayerCommand=a.payload
      }
    },extraReducers:(b)=>{
      b.addCase(changeSongStatus.fulfilled,(s,a)=>{
        s.songStatus=a.payload.songStatus
        s.apiLoading='ff'
      }).addCase(changeSongStatus.rejected,(s,a)=>{
        s.apiLoading='rejected'
      }).addCase(getSessionPlaylist.fulfilled,(s,a)=>{
        const playlistData:playlistsObjectType=a.payload
        s.songs=[...playlistData.songs]
        
      }).addCase(addPlayerTracks.fulfilled,s=>{
        s.changedTracks=s.changedTracks+1
      }).addCase(leaveSessThunk.fulfilled, (s,a)=>{
          if(s.currentSession===a.meta.arg.old_session){
            s.songs=[];
            s.currentSession=null;
          }
      }).addCase(joinSessThunk.fulfilled,(s,a)=>{
        s.currentSession=a.meta.arg.new_session
      })
    }
})


export default slice.reducer;
export const {changePlayerSongTrack,setOpenPlayerCount}=slice.actions
export const changeSongStatus=createAsyncThunk('player/songstatus/api',
async (data:{state:'pause'|'play'|'next'|'previous',
start?:Boolean},{getState})=>{
  let uris;
 /*if (data.state==='pause')return await Spotify.pauseTrack();
 else if(data.state==='play'){
  if(data.start){
   const root:RootState= getState();
   uris=root.sessions.currentPlaylist.songs.map(v=>v.uri)
  }
  return await Spotify.playTracks(uris)

 }
 else return data.state*/
 /*
else if(data.state==='next')return await Spotify.nextTrack()
else if(data.state==='previous')return await Spotify.previousTrack()
*/

})


export const getPlayerSongStatus=(s:RootState)=>s.player.songStatus
export const  {changePlayerStatus,initPlayer}=slice.actions
window.changePlayerStatus=changePlayerStatus;
export const addPlayerTracks=createAsyncThunk('addplayertreacks',async (_,{getState})=>{
  
  const root:RootState=getState()
  const uris=root.player.uris
  return await Spotify.playTracks(uris)
})

