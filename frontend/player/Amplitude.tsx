import * as React from 'react'
import  * as ReactDOM  from 'react-dom';
//import Spotify from '../spotify/Spotify'
import { changePlayerSongTrack, getPlayerSongStatus, setOpenPlayerCount } from './playerSlice'
import { useAppDispatch, useAppSelector} from "../app/hooks";
import { changeSongStatus, addPlayerTracks } from './playerSlice';
import { RootState } from '../app/store';
const Amplitude:any=window.Amplitude;

function w3_open(e:string) {
    document.getElementById(e).style.display = "block";
  }
  
  function w3_close(e:string) {
    document.getElementById(e).style.display = "none";
  }
export const Player=()=>{
    const songs=useAppSelector((s:RootState)=>s.player.songs)
    const dispatch=useAppDispatch()
    const openPlayerCount=useAppSelector(s=>s.player.openPlayerCount)
    const activeSession=useAppSelector(s=>s.sessions.activeSession)
  React.useEffect(()=>{
    if(!songs)return
    if(!songs.length){
        Amplitude.init({
            "songs": []})
            return;
    };
    Amplitude.stop()
 Amplitude.init({
        "songs": amplitudeSongs})    

// This simply stops whatever song is active.

//delay between songs
if(Amplitude.getDelay()<(3e3)){
Amplitude.setDelay( 3e3 )
}
 //Amplitude.playSongAtIndex( 0 )
},[songs.length,songs[0]])
React.useEffect(()=>{
    if(activeSession==null){
        Amplitude.stop()
    }
  },[activeSession])
      if(!songs.length && openPlayerCount==='opened'){
    return null;
    
}
    
   const amplitudeSongs=songs.map((v:any)=>{
    return {
        name:v.name,
        artist:v.artists.map((v:any)=>v.name).join(', '),
        album:v.album.name,
        url:v.preview_url,
        "cover_art_url":(v.album.images[0].url||
        "https://521dimensions.com/img/open-source/amplitudejs/album-art/we-are-to-answer.jpg"),
        "time_callbacks": {1:function(){
            dispatch(changePlayerSongTrack(Number(Amplitude.getActiveIndex())))
        }}
    }
   })



  
  const sidebar=(

    <div style={{zIndex:2, display:(openPlayerCount==='opened'?"block":"none")}} 
    id="playerSidebar" 
    className="w3-sidebar w3-bar-block w3-col m8 w3-animate-left" >
    <button style={{width:"100%"}} 
    className="w3-bar-item w3-button w3-large"
     onClick={()=>dispatch(setOpenPlayerCount('closed'))}>Close 
      <span className="w3-right">&times;</span></button>
      
      <div id="blue-playlist-container" className='w3-container w3-margin'>
  <div id="amplitude-player">
    <LeftPlayer  />
    <RightPlayer  />
</div>

</div>
    </div>

  )
let container = document.getElementById('playerSidebar-container');
if(!container){
container=document.createElement('div')
container.id='playerSidebar-container';
const body=document.body
body.insertBefore(container, body.children[0])
}
return ReactDOM.createPortal(sidebar,
  container )
}

const LeftPlayer=()=>{
    return (	
    <div id="amplitude-left">
        <img data-amplitude-song-info="cover_art_url" className="album-art"/>
<div className="amplitude-visualization" id="large-visualization">

</div>
        <div id="player-left-bottom">
            <div id="time-container">
                <span className="current-time">
                    <span className="amplitude-current-minutes" ></span>:<span className="amplitude-current-seconds"></span>
                </span>
                <div id="progress-container">
                    <div className="amplitude-wave-form">

            </div>
    <input type="range" className="amplitude-song-slider"/>
                    <progress id="song-played-progress" className="amplitude-song-played-progress"></progress>
                    <progress id="song-buffered-progress" className="amplitude-buffered-progress" value="0"></progress>
                </div>
                <span className="duration">
                    <span className="amplitude-duration-minutes"></span>:<span className="amplitude-duration-seconds"></span>
                </span>
            </div>

            <div id="control-container">
                <div id="repeat-container">
                    <div className="amplitude-repeat" id="repeat"></div>
                    <div className="amplitude-shuffle amplitude-shuffle-off" id="shuffle"></div>
                </div>

                <div id="central-control-container">
                    <div id="central-controls">
                        <div className="amplitude-prev" id="previous"></div>
                        <div className="amplitude-play-pause" id="play-pause"></div>
                        <div className="amplitude-next" id="next"></div>
                    </div>
                </div>

                <div id="volume-container">
                    <div className="volume-controls">
                        <div className="amplitude-mute amplitude-not-muted"></div>
                        <input type="range" className="amplitude-volume-slider"/>
                        <div className="ms-range-fix"></div>
                    </div>
                    <div className="amplitude-shuffle amplitude-shuffle-off" id="shuffle-right"></div>
                </div>
            </div>

            <div id="meta-container">
                <span data-amplitude-song-info="name" className="song-name"></span>

                <div className="song-artist-album">
                    <span data-amplitude-song-info="artist"></span>
                    <span data-amplitude-song-info="album"></span>
                </div>
            </div>
        </div>
    </div>
    )
}

const RightPlayer=()=>{
    const songs=useAppSelector(s=>s.player.songs)
    const elements=songs.map(
        (v:any,i:number)=>(<RightSongItem  index={i} key={i} song={v} />)
    )
return (
<div id="amplitude-right">
{elements}
</div>)
}

const RightSongItem=({song,index}:{song:any,index:number})=>{


  return  <div className="song amplitude-song-container amplitude-play-pause" data-amplitude-song-index={index}>
    <div className="song-now-playing-icon-container">
        <div className="play-button-container">

        </div>
        <img className="now-playing" src="https://521dimensions.com/img/open-source/amplitudejs/blue-player/now-playing.svg"/>
    </div>
    <div className="song-meta-data">
        <span className="song-title">{song.name}</span>
        <span className="song-artist">{song.artists.map((v:any)=>v.name).join(', ')}</span>
    </div>
    <a href="https://switchstancerecordings.bandcamp.com/track/risin-high-feat-raashan-ahmad" className="bandcamp-link" target="_blank">
        <img className="bandcamp-grey" src="https://521dimensions.com/img/open-source/amplitudejs/blue-player/bandcamp-grey.svg"/>
        <img className="bandcamp-white" src="https://521dimensions.com/img/open-source/amplitudejs/blue-player/bandcamp-white.svg"/>
    </a>
    <span className="song-duration">3:30</span>
</div>
}