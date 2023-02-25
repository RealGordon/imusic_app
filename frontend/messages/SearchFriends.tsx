import * as React from 'react'
import { FormEvent, useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import {useAppDispatch,useAppSelector} from '../app/hooks'
import { SpinnerLoader } from '../General';
import { changePartner, searchFriendsThunk } from "./friendsSlice";
export const FriendSearch=()=>{
   const dispatch= useAppDispatch()
   const apiLoading=useAppSelector(s=>s.friends.apiLoading)
   const usersResults=useAppSelector(s=>s.friends.searchResults)
if(apiLoading.state==='pending')return <SpinnerLoader state={apiLoading.state} />;
const friendCards=usersResults.length && usersResults.map(
    (v)=>(<Friend key={v.uid}  {...v}   />)
)

const onFormSubmit=(e:React.FormEvent)=>{
    e.preventDefault()
dispatch(searchFriendsThunk(e.target.friendsSearch.value))

}
return <div className="w3-main w3-container"  style={{marginLeft:200}}>

<form onSubmit={onFormSubmit} className='w3-margin-top'>
    <div className='w3-cell-row'>
   <input style={{width:"85%"}} className='w3-cell' 
   name='friendsSearch' placeholder='search friends...'  />
   <button  type='submit' className='w3-cell w3-btn w3-blue'>search</button>
   </div>
   </form>
    <div className="w3-container w3-margin">
        {friendCards?friendCards:<h2>no results found</h2>}
    </div>
</div>
}

const Friend=({email,displayName,name,uid}:{email:string,
displayName:string,uid:string,name:string
})=>{
    const dispatch=useAppDispatch()
    const navigate= useNavigate()
const onMessageClick=(e:any)=>{
dispatch(changePartner({uid,
    displayName:displayName?displayName:name,email}))
navigate('/static/imusic/chat')

}
    return <div style={{padding:0}} className="w3-col m3 w3-border w3-card w3-margin w3-white" >
        <img  src="/resources/images/img_avatar_man.png"  
        width='100%'
        />
        <div className="w3-container">
        <p className='w3-large'>{displayName||name}</p>
        <p className='w3-serif'>Email: {email}</p>

        </div>
        <button style={{width:'100%'}} data-uid={uid} onClick={onMessageClick}
className="w3-button w3-block w3-dark-grey w3-text-white">Message</button>
    </div>
}