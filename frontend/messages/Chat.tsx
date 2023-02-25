import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { changePartner, getFriendDetailsThunk, sendMessageThunk } from './friendsSlice';

export const Chat=()=>{
  const  friendUid  = useAppSelector(s=>s.friends.partner)

  const user=useAppSelector(s=>s.user.user)
 const reduxMessages=useAppSelector(s=>s.friends.messages)

const chatMessages=reduxMessages[friendUid];
let messages;
 messages=!chatMessages?[]: chatMessages.messages.map(
    (v:any,i:any)=>(<Message preMessage={chatMessages.messages[i-1]}
         key={i} message={v} userID={user.uid} />)
)
return  <>
<SidePanel />
<div className='w3-main w3-col m7 w3-container w3-border' 
    style={{overflowX:'clip',marginLeft:330,height:'80%',
    position: "fixed",bottom:'2%',paddingRight:0,paddingLeft:0,
    paddingBottom:0,
    backgroundImage:'url("/resources/images/whatsapp_background.jpg")'
    }}>
<div style={{overflowY:'scroll',bottom:'17%',height:'80%',width:'100%'}}
className='messages-area w3-container w3-margin'>
{messages}
</div>
    
   <MessageSender   receiver={friendUid}   />
    </div></>
}

const messageTest=/\w{3,100}/
const MessageSender=({receiver}:{receiver:string})=>{
    const user=useAppSelector(s=>s.user.user)
    const dispatch=useAppDispatch()

const sendMessage=(e:React.FormEvent)=>{
e.preventDefault()
if(!receiver)return;
if(!messageTest.test(e.target.text.value))return;
const message={
r:receiver,
s:user.uid,
text:e.target.text.value,
senderName:user.displayName,
members:[user.uid,receiver]
}
dispatch(sendMessageThunk(message))
e.target.text.value=''
}
return <form onSubmit={sendMessage} 
className='w3-container w3-cell-row'
style={{
    //width:700,
    position:'absolute',
bottom:'2%',
height:'15%'
}} 
>
    <div className='w3-cell' style={{width:'90%'}}>
<textarea name='text' className='w3-input' 
placeholder='write your message here...'
></textarea></div>
<div className='w3-cell'><button type='submit' >
    send
    </button></div>
</form>
}
const Message=({message,userID,preMessage}:{preMessage:any, message:any,userID:string})=>{
const ownPreviousMsg=preMessage && preMessage.s===userID;
const right=(message.s===userID)
  if (right){
    return (<div style={{width:'100%'}} 
    className={'w3-cell-row'+(ownPreviousMsg?'':
     ' w3-margin-bottom w3-margin-top')}>
    <div className='w3-cell'></div>
    <div style={{width:'70%'}} className='w3-cell'>
        <p style={{backgroundColor:'cornsilk'}} className='w3-right w3-white w3-border w3-round-xlarge w3-padding'>
            {message.text}</p>
    </div>
    </div>)
  }
   return <div style={{width:'100%'}} className='w3-cell-row w3-margin-top w3-margin-bottom'>
    <div style={{width:'70%'}} className='w3-cell'>
    <p style={{backgroundColor:'cornsilk'}}
     className='w3-left w3-border w3-round-xlarge w3-padding'>
        {message.text}</p>  
    </div>
    <div className='w3-cell'></div>
    </div>
         
    
}

const SidePanel=()=>{
    const messages=useAppSelector(s=>s.friends.messages)
const ids=Object.keys(messages)
    const partners=useAppSelector(s=>s.friends.partners)
    const currentPartner=useAppSelector(s=>s.friends.partner)
const partnerMessage=ids.find(v=>v===currentPartner)
if(!partnerMessage){
    ids.push(currentPartner)
}
const cards=ids.map(id=>{
    return <UserCard  key={id} partnerID={id} 
    newStatus={messages[id] && messages[id]['status']}
    fmessage={messages[id] && messages[id]['messages'][0]}  
    partners={partners} />
})
   return <nav className="w3-sidebar w3-collapse 
    w3-animate-left" 
    style={{
        backgroundColor: "linear-gradient(-226deg, #3BD2AE 0%, #36BAC2 100%)",
        //zIndex:2,
    width:300}} ><br />
      <div className="w3-bar w3-container" style={{width:'100%',
   
        backgroundColor: "linear-gradient(-226deg, #3BD2AE 0%, #36BAC2 100%)"
    }}> 
      {cards}
      </div></nav>
}
type Partner ={
    name?:string,uid:string,email?:string,displayName?:string
}
const UserCard=({partnerID,newStatus,fmessage,partners}:{
    partnerID:string,fmessage:any,newStatus:string,partners:Partner[]})=>{
        const dispatch=useAppDispatch()
       const partner= partners.find((v:Partner)=>v.uid===partnerID)
React.useEffect(()=>{
if(partner)return;
dispatch(getFriendDetailsThunk(partnerID))
},[partner])

const onClickPartner=(e:any)=>{
e.stopPropagation()
 dispatch(changePartner({uid:partnerID}))
}

return <div style={{width:'100%',backgroundColor:'cornsilk'}}  
className='w3-bar-item w3-card w3-border  w3-white' 
onClick={onClickPartner} >
    <img className='w3-circle w3-left w3-margin-right' width={45} height={45}
    src='/resources/images/img_avatar_man.png' />
   {partner && <p className='w3-margin-left'>{partner.name||partner.displayName}</p>}
    {newStatus=='new'?<div className='w3-text-green'><EnvelopeIcon />
     </div>:
    null}
</div>
}

const EnvelopeIcon=()=>{
    
    return (
      <div className='w3-right w3-margin-left w3-round'>
      <img style={{backgroundColor:'#3bd2ae'}} 
      src='/resources/icons/envelope-regular.svg' 
    width={15} height={15} />
    </div>)
  }