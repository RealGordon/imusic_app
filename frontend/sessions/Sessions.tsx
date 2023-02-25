import * as React from "react";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { ActiveSession } from "./ActiveSession";
import { ProjectCard } from "./ProjectCard";
import { SpinnerLoader } from "../General";
import { changeCurrentSess, changeSessionDisp, getCurrentSession, getReduxSessions } from "./sessionsSlice";
import { useLocation, useNavigate } from "react-router-dom";
const inviteRE=/privacy=(\w+)&session=(\w+)/;
export const Sessions=()=>{
  const sessions=useAppSelector(getReduxSessions)
  const currentSession=useAppSelector(getCurrentSession)
  const apiLoading=useAppSelector(s=>s.sessions.apiLoading)
  const  disp=useAppSelector(s=>s.sessions.display)
  const navigate=useNavigate()
  const dispatch=useAppDispatch()
  
  React.useEffect(()=>{
    if(!location.search)return;
   const match=location.search.match(inviteRE)
   if(!match)return;
  dispatch(changeCurrentSess({id:match[2]}))
navigate('/static/imusic/sessions')
  },[location.search])
  if(apiLoading==='pending')return <SpinnerLoader state={apiLoading} />;
  
   let content=null;
  if(disp==='list'){
 content=sessions.map((v,i)=>{
  return  <ProjectCard key={i} session={v} />
}
  )
}
else if(disp!==null){
content=<ActiveSession id={currentSession} />
}
    return (
    <>
 <SideMenu />
 <div className="w3-main" style={{marginLeft:300}}>
        {content}</div>
</>)
}
const SideMenu=()=>{
  const dispatch=useDispatch()
   /*  <!-- Sidebar/menu -->*/
return <nav className="w3-sidebar w3-collapse w3-white w3-animate-left" 
style={{
  zIndex:1,
  width:300}} id="mySidebar"><br />
  <div className="w3-container">
    <a href="#" onClick={()=>("w3_close()")} className="w3-hide-large w3-right w3-jumbo w3-padding w3-hover-grey" title="close menu">
      <i className="fa fa-remove"></i>
    </a>
   {/*<img src="images/profile_pic.jpg" style={{width:"45%"}} className="w3-round" /><br /><br />
    <h4><b>PORTFOLIO</b></h4>*/}
    
  </div>
  <div className="w3-bar-block">
  {/*  <a href="#portfolio" onClick={w3_close()} className="w3-bar-item w3-button w3-padding w3-text-teal"><i className="fa fa-th-large fa-fw w3-margin-right"></i>PORTFOLIO</a> 
    <a href="#about" onclick="w3_close()" className="w3-bar-item w3-button w3-padding"><i className="fa fa-user fa-fw w3-margin-right"></i>ABOUT</a> 
    <a href="mailto:gordam.edoc@gmail.com" onclick="w3_close()" className="w3-bar-item w3-button w3-padding"><i className="fa fa-envelope fa-fw w3-margin-right"></i>CONTACT</a>*/}
  <button  className="w3-bar-item w3-button w3-padding w3-text-teal" 
      onClick={()=>dispatch(changeSessionDisp('active_session'))}>Active Session</button>
 <button  className="w3-bar-item w3-button w3-padding w3-text-teal" 
      onClick={()=>dispatch(changeSessionDisp('list'))}>Sessions</button>
  </div>
  <div className="w3-panel w3-large">
   {/* <!--<i className="fa fa-facebook-official w3-hover-opacity"></i>
    <i className="fa fa-instagram w3-hover-opacity"></i>
    <i className="fa fa-snapchat w3-hover-opacity"></i>
    <i className="fa fa-pinterest-p w3-hover-opacity"></i>
    <i className="fa fa-twitter w3-hover-opacity"></i>-->*/}
    {/*<a target="_blank" 
    href="https://linkedin.com/in/gordon-amamoo-79ab61103/">
      <b>Linked</b><i className="fa fa-linkedin w3-hover-opacity">
        </i></a>*/}
  </div>
</nav>
}