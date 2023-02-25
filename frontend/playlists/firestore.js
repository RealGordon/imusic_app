//import Spotify from "../spotify/Spotify";
//import { initializeApp } from "firebase/app";
//import { getDocs,query, collection, where, limit,setDoc, doc, addDoc} from "firebase/firestore";
// Initialize Firebase
//import { db } from "../firestore/init";

export const changePlaylistPropsFire=async (args)=>{
    await db.collection('amalitech').doc('imusic')
    .collection('playlists').doc(args.id).set(args.props,{merge:true})
    return args
}
/**
 * 
 * @param {string} uid 
 * @returns 
 */
export const getFireplaylists=async (uid)=>{
    try{
      
const qsnap=await db.collection('amalitech').doc('imusic').collection( 'playlists')
.where('owner','==',uid)
.limit(15)
.get()
return qsnap.docs.map(snap=>{
    const data=snap.data()
data.id=snap.id;
return data
})
    }catch(e){
        console.log(e)
        return []
    }
}

export const savePlaylistFire=async (data)=>{
    const {playlist,user}=data;
  
    try{
if(playlist.id){
 await db.collection('amalitech').doc('imusic')
.collection('playlists').doc(playlist.id).set({...playlist},{merge:true})
 return playlist
}
playlist.owner=user.uid

 const ref= await db.collection('amalitech')
 .doc('imusic').collection('playlists').add({...playlist})

return (playlist.id=ref.id,playlist)
}catch(e){
    console.log(e)
    throw e
}
}
