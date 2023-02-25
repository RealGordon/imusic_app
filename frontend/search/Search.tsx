import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { SpinnerLoader } from '../General';
import { addSongToInterPlylt, changePlaylistProps } from '../playlists/playlistsSlice';
import { getSongs } from './slice';


export const SongsSearch=(props:any)=>{
    const dispatch=useAppDispatch()
    const loadingState=useAppSelector(s=>s.songs.state)
    const songs=useAppSelector(s=>s.songs.results)
   
    if(loadingState=='pending'){
        return  <SpinnerLoader state={loadingState} />;
    }
const onFormSubmit=(e:any)=>{
e.preventDefault();
dispatch(getSongs(e.target.songSearch.value))

}
const addToPlaylist=(e:any)=>{
e.stopPropagation();
const songURI=e.target.dataset.uri;
const song=songs.find(v=>songURI===v.uri);
//add to current playlist
dispatch(addSongToInterPlylt(song))
}
const songsResults=songs && songs.map((v,i)=>{
    return <tr  key={i}><td><h3>{v.name}</h3>
        <h5 className='w3-serif'>Album: {v.album.name}</h5>
        <h6><span>Artists: {v.artists.map((v:any)=>v.name).join(" | ")}</span></h6>
        </td><td><button  data-uri={v.uri} onClick={addToPlaylist}>add</button></td></tr>
})
return <div className='w3-container w3-margin-top w3-border'>
    <form onSubmit={onFormSubmit}>
    <div className='w3-cell-row'>
   <input style={{width:"85%"}} className='w3-cell' name='songSearch' placeholder='search songs...'  />
   <button  type='submit' className='w3-cell w3-btn w3-blue'>search</button>
   </div>
   </form>
   {!songsResults &&  <h3>no results</h3>}
  {songsResults && <table className='w3-table-all w3-margin-top'>
    <thead><tr><th style={{width:"85%"}}>Song Results</th><th style={{width:"15%"}}></th></tr></thead>
    <tbody>{songsResults}</tbody>
    </table> }
</div> 
}