//import Spotify from "../spotify/Spotify";
//import { initializeApp } from "firebase/app";
//import {getDocs,query, collection, where, limit} from "firebase/firestore";
// Initialize Firebase
//import { db } from "../firestore/init";



export const changeSessPropsFire=async (args)=>{
    await db.collection('amalitech').doc('imusic')
    .collection('sessions').doc(args.id).set(args.props,{merge:true})
    return args
}
/**
 * 
 * @param {{uid:string,email:string}} user
 * @returns
 */
export const getFireSessions=async (user)=>{
try {
 
const qsnap2=await db.collection('amalitech').doc('imusic').collection('sessions')
.where('privacy','==','public')
.limit(15)
.get()
const qsnap1=await db.collection('amalitech').doc('imusic').collection('sessions')
.where('privacy','==','private')
.where('owner','==',user.uid)
.limit(15)
.get()
const data1= qsnap1.docs.map(v=>{
    const doc=v.data()
    doc.id=v.id
    return doc
})
const data2=qsnap2.docs.map(v=>{
    const doc=v.data()
    doc.id=v.id
    return doc
})
return [...data1,...data2]
}catch (e){
    console.log(e)
    return []
}
}

export const saveSessionFire=async (data)=>{
    const {session,user}=data;
    try{
if(session.id){
return await db.collection('amalitech').doc('imusic')
.collection('sessions').doc(session.id).set(session,{merge:true})
 //return await  setDoc (doc(db,'amalitech','imusic','playlists',playlist.id),playlist,{merge:true})
}
session.owner=user.uid
/*const ref= await addDoc(collection(db,'amalitech','imusic','playlists'),
 {...playlist})
 */
 const ref= await db.collection('amalitech')
 .doc('imusic').collection('sessions').add({...session})

return (session.id=ref.id,session)
}catch(e){
    console.log(e)
    throw e
}
}
/**
 * 
 * @param {{old_session:string,new_session:string,
 * user:any}} data
 * 
 */
export const joinSession=async ({old_session,new_session,
    user})=>{
//connect to peerjs
//send a session request

if(old_session){
    await db.collection('amalitech').doc('imusic')
.collection('live_sessions').doc(old_session).set(
    {   
        participants:firebase.firestore
        .FieldValue.arrayRemove(user.uid)
        
    },{merge:true})
}
//join session
await db.collection('amalitech').doc('imusic')
.collection('live_sessions').doc(new_session).set(
    {   
        participants:firebase.firestore.FieldValue.arrayUnion(user.uid)
    },{merge:true})
//dispatch(getSessionPlaylist(new_session))
return new_session

}
export const getFireActivePlaylist=async ({uid,playlist_id,session_id})=>{
 /*
 const qsnap1= await db.collection('amalitech').doc('imusic')
.collection('live_sessions').where('participants','array_contains',[uid])
.limit(1).get()
 qsnap1.forEach((docsnap)=>{
 const data=docsnap.data()
 })*/
 let qsnap2,qsnap3,playlistData;
  qsnap2= await db.collection('amalitech').doc('imusic')
.collection('playlists').where('sessions','array-contains',session_id)
.limit(1).get()
if(!qsnap2.empty){
playlistData=qsnap2.docs[0].data()
playlistData.id=qsnap2.docs[0].id
}
else {
    qsnap3= await db.collection('amalitech').doc('imusic')
    .collection('playlists').doc(playlist_id).get()
    playlistData=qsnap3.data()
    playlistData.id=qsnap3.id
}
return playlistData
}

export const LeaveSession=async ({old_session,user})=>{
    await db.collection('amalitech').doc('imusic')
    .collection('live_sessions').doc(old_session).set(
        {   
            participants:firebase.firestore
            .FieldValue.arrayRemove(user.uid)
            
        },{merge:true})
    
}

export const ListenToSessions= (dispatch,getLiveSession)=>{
    console.log('listening to live sessions')
   return  db.collection('amalitech').doc('imusic')
    .collection('live_sessions')
  .onSnapshot({
        next:function(qsnap){
         const changes=qsnap.docChanges()
   const dataChanges= changes.map(change=>{
    if(change.type!=='modified' && change.type!=='added')return;
     const data=change.doc.data()
     data.id=change.doc.id
     return data
    })
    dispatch(getLiveSession(dataChanges))
        
        }
    })
}