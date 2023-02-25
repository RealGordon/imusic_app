import React,{useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import {setOpenPlayerCount} from '../player/playerSlice'
function w3_open(e) {
  document.getElementById(e).style.display = "block";
}

function w3_close(e) {
  document.getElementById(e).style.display = "none";
}

export const Nav=({user , menu_items})=>{
 

  const pathname= useLocation().pathname;
  const create_buttons=(main)=>{
    return menu_items.map(
      ([route,title],i)=>{
       
        if((!user || !user.email) && (title==='Playlists' || title==='Friends' ||title==='Chat'))return null;
        if(main){
         
        return   <li className="w3-bar-item w3-mobile" key={i} >
<NavLink to={route}  className="w3-bar-item  w3-button tablink">
          {title}
          {title==='Chat' && <EnvelopeIcon />}
          {title==='Player' && <SoundIcon />}
          </NavLink></li>
        }
      return  <NavLink to={route} key={i} className="w3-bar-item  w3-button">
          {title}</NavLink>
        
      }
    )
  }
  
    return (
    ReactDOM.createPortal((
      <>
      <div style={{display:"none",width:300}} id="mainSidebar" 
      className="w3-sidebar w3-bar-block  w3-animate-left w3-hide-large" >
     
    
      <button style={{width:"100%"}} 
      className="w3-bar-item w3-button w3-large w3-hide-large"
       onClick={()=>w3_close('mainSidebar')}>Close 
        <span className="w3-right">&times;</span></button>
        {create_buttons()}
       {/* <NavLink to="/static/products"  className="w3-bar-item w3-button ">Products
        </NavLink>
      <div className="w3-dropdown-hover">
      <button  className="w3-button">Sales</button>
      <div  className='w3-dropdown-content w3-bar-block w3-border'
      >
        <NavLink to="/static/sales/create"  className="w3-bar-item w3-button">Create</NavLink>
        <NavLink to="/static/sales/list"  className="w3-bar-item w3-button">List</NavLink>
        </div>
        </div>
      
     <NavLink to="/static/sessions" className="w3-bar-item  w3-button">Session</NavLink>
     <NavLink to="/static/playlists"  className="w3-bar-item w3-button">Playlists</NavLink>*/}
      
      {(user && user.email) ?(null):<a  href="/static/imusic/signin.html" 
      className="w3-bar-item w3-button tablinks">Login</a>} 
    
      </div>
      
     <div style={{position:'sticky',top:0}} className="w3-bar w3-black">
     <button 
     className="w3-right w3-hide-large w3-button w3-teal w3-xlarge" 
     onClick={()=>w3_open('mainSidebar')}>&#9776;</button>
      <ul className="w3-hide-small">
     {create_buttons(true)}
      {/*<li  className="w3-bar-item">
        <NavLink to="/static/products"  className="w3-button">Products
        </NavLink></li>
      <li className="w3-dropdown-hover w3-mobile">
      <button  className="w3-button">Sales</button>
      <div  className='w3-dropdown-content w3-bar-block w3-border'
      >
        <NavLink to="/static/sales/create"  className="w3-bar-item w3-button">Create</NavLink>
        <NavLink to="/static/sales/list"  className="w3-bar-item w3-button">List</NavLink>
        </div></li>
      
      <li className="w3-bar-item w3-mobile" ><NavLink to="/static/stock" 
      className="w3-button">Stock</NavLink></li>
     <li className="w3-bar-item w3-mobile" ><NavLink to="/static/customers" 
      className="w3-button">Customers</NavLink></li>*/}
      {(user && user.email)?(null):<li className="w3-bar-item w3-mobile">
        <a  href="/static/imusic/signin.html" 
        className="w3-bar-item w3-button tablinks">Login</a></li>}
      

      </ul>

      <UserCard  user={user} />
      <DiscIcon  />
      {/*<EnvelopeIcon  />*/}
      </div>
    
    
    </>),
    document.getElementsByTagName('nav')[0]
    )
    )

}

const DiscIcon=()=>{
  const dispatch=useDispatch()
  const {songs,currentSong}=useSelector(s=>s.player)
  if(!songs||!songs.length )return null;
  const onDiscClick=(e)=>{
    e.stopPropagation()
    dispatch(setOpenPlayerCount(undefined))
    }
    const {images}=songs[currentSong].album
return  <button  onClick={onDiscClick}  style={{display:'contents', width:56,height:56}}
>
<img style={{backgroundImage:
'url('+((images && images[2]  && images[2].url)||'')+')'}} 
width={50} height={50} 
className='w3-circle w3-border w3-border-white w3-bar-item w3-button tablinks w3-right w3-margin-right'  
   src='/resources/icons/compact-disc-solid.svg' /></button>

}
const UserCard=({name,page,user})=>{
  if(!user)return null;
  const butt_props={};
  if(user.displayName)butt_props.onClick=()=>(w3_open('loginSidebar'));
  const userCard=(<div className="w3-right">
  <div id="avatar" className="chip">
   <button {...butt_props}  style={{ display:"contents"}}>
    <img  src="/resources/images/img_avatar_man.png" alt="Person" width="96" height="96" /></button>
    <span className="w3-hide-small">{user.displayName||'UnKnown User'}</span>
  <UserCardMenu   user={user} /></div></div>);
  
  return userCard
  }

const onLogout=(e)=>{
  e.preventDefault()
  firebase.auth().signOut()
.then(()=>{
const el=document.createElement('a')
el.id='firebase-logout'
el.href='/static/imusic/index.html'
document.body.insertBefore(el,document.body.children[0])
el.click()
  })
}
  const UserCardMenu=({name,user})=>{
if(!user)return null;
if(!user.email)return null;
    const content= (
    <div className="w3-sidebar w3-bar-block w3-border-right" 
    style={{display:"none",zIndex:2}} 
    id="loginSidebar">
      <button onClick={()=>w3_close('loginSidebar')} className="w3-bar-item w3-large">Close <span className="w3-right">&times;</span></button>
      <button  className="w3-bar-item w3-button">{user.displayName}</button>
      <a  onClick={onLogout}  className="w3-bar-item w3-button">Logout</a>
      <a id='firebase-logout'   className="w3-bar-item w3-button"></a>
    </div>)
    let container=document.getElementById('logout-menu');
    if(!container){
      const body=document.querySelector('body');
      const check=body.children[0];
      if(check.id!=='logout-menu'){
      container=document.createElement('div');
        container.id='logout-menu';
        body.insertBefore(container,check)
      }
    }

    return ReactDOM.createPortal(content,container)
    }

  const EnvelopeIcon=()=>{
    const readStatus= useSelector(s=>s.friends.readStatus.status)
    if(readStatus!=='new')return null;
    return (
      <div className='w3-right w3-margin-left w3-round'>
      <img style={{backgroundColor:'#3bd2ae'}} 
      src='/resources/icons/envelope-regular.svg' 
    width={15} height={15} />
    </div>)
  }

  const SoundIcon=()=>{
    const songs= useSelector(s=>s.player.songs)
    if(!songs||!songs.length)return null;
    return (
      <div className='w3-right w3-margin-left w3-round'>
      <img style={{backgroundColor:'#3bd2ae'}} 
      src='/resources/icons/volume-high-solid.svg' 
    width={15} height={15} />
    </div>)
  }