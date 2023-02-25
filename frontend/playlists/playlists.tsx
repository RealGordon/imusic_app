import * as React from "react";
import {useState,useEffect} from "react"
import { SingleProject } from "./SingleProject";


import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector} from "../app/hooks";
import { changeCurrentPlyl, getCurrentPlaylist, playlistsSelector } from "./playlistsSlice";

import { SpinnerLoader } from "../General";
export const Playlists=(props:any)=>{
  
  const user =useAppSelector(s=>s.user.user)
    
    const currentPlaylist=useAppSelector(getCurrentPlaylist)
   
    const apiLoading= useAppSelector(s=>s.playlists.apiLoading)
    if(apiLoading==='pending')return <SpinnerLoader  state={apiLoading }/>
      let content;
     
      if (currentPlaylist == 'list') {
        content=<List user={user}  />;
      }
      else   {
      
        content = <SingleProject id={currentPlaylist} />;
      }
    return (
        <>
      {/*  <!-- Sidebar/menu -->*/}
        <SideMenu  />
        <div className="w3-main" style={{marginLeft:300}}>
        {content}</div>
    </>)
}
const SideMenu=(props:any)=>{
    const dispatch=useDispatch()
    return (
        <nav className="w3-sidebar w3-collapse w3-white w3-animate-left" 
    style={{
     // zIndex:3,
      width:300}} id="mySidebar"><br />
      <div className="w3-container">
        {/*<a href="#" onClick="w3_close()" className="w3-hide-large w3-right w3-jumbo w3-padding w3-hover-grey" title="close menu">
          <i className="fa fa-remove"></i>
    </a>*/}
      
        
      </div>
      <div className="w3-bar-block">
    
      <button onClick={()=>{
        dispatch(changeCurrentPlyl('new'))
        }}  className="w3-bar-item w3-button w3-padding w3-text-teal">
        Create Playlist</button> 
      <button  className="w3-bar-item w3-button w3-padding w3-text-teal" 
      onClick={()=>dispatch(changeCurrentPlyl('list'))}>Playlists</button>
      </div>
      <div className="w3-panel w3-large">
       {/* <!--<i className="fa fa-facebook-official w3-hover-opacity"></i>
        <i className="fa fa-instagram w3-hover-opacity"></i>
        <i className="fa fa-snapchat w3-hover-opacity"></i>
        <i className="fa fa-pinterest-p w3-hover-opacity"></i>
        <i className="fa fa-twitter w3-hover-opacity"></i>-->*/}
        {/*<a target="_blank" 
        href="https://linkedin.com/in/gordon-amamoo-79ab61103/"><b>Linked</b><i className="fa fa-linkedin w3-hover-opacity"></i></a>*/}
      </div>
    </nav>
    )
}
type listProps ={
  user:any
}
const List =(props:listProps)=>{
  const {user}=props;
  let list=useAppSelector(playlistsSelector)
  const dispatch=useAppDispatch()
  
  
  const onClick=(e:React.SyntheticEvent)=>{
    e.stopPropagation();
const id=e.currentTarget.dataset.playlistid;
dispatch(changeCurrentPlyl(id))
 
  }
list=list.filter(v=>v.owner===user.uid)
const  content=list.map(
  ({name,id,songs},i)=>{
  return <div key={i} data-playlistid={id} onClick={onClick} 
   className="w3-col m3 w3-container w3-card w3-round-xlarge  w3-sand w3-margin w3-white"
   style={{height:450,padding:0}}>
 <img className="w3-round-xlarge" src={songs[0].album.images[1].url} 
 height={200} width={"100%"} ></img>
 <p className="w3-serif w3-large w3-padding">
    <b>{name}</b></p>
<p className="w3-padding w3-large" >{songs.length} songs</p>

   </div>
  }
  
)
if(content.length===0){
  return <div className="w3-main" style={{marginLeft:310}}>
    <h3 >no results found</h3></div>;
    }
return <div className="w3-main">
  {content}</div> 

}