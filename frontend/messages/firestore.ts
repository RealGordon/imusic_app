const db=window.db;
const firebase=window.firebase;
export const searchFriendsFire=async(email:string)=>{
   const qsnap=await db.collection('amalitech').doc('imusic')
   .collection('users')
   .where('email','==',email)
   .get()
if(qsnap.empty)return [];
else return qsnap.docs.map((v:{id:string,data:Function})=>{
   
  const data= v.data()
  //data.uid=v.id
  return data

})
}

export const listenMessages=(uid:String,dispatch:Function,getMessages:Function)=>{
 console.log('running listening to messages')
   return db.collection('amalitech').doc('imusic')
   .collection('messages')
   .where('members','array-contains',uid)
   .onSnapshot({
next:function(qsnap:any){
 const changes=qsnap.docChanges()
 dispatch(getMessages({uid,
  messages:changes.map((v:{doc:any,type:'added'|'modified'})=>{
   const data=v.doc.data()
   if(data.date)data.date=data.date.toDate().toISOString();
   return data

})}))
}
   })

}
export const sendMessageFire=async (message:any)=>{
  message.date= firebase.firestore.FieldValue.serverTimestamp();
  await db.collection('amalitech').doc('imusic')
   .collection('messages').add(message)

}

export const getFriendDetailsFire=async (uid:string)=>{
   const qsnap=await db.collection('amalitech').doc('imusic')
   .collection('users')
   .where('uid','==',uid)
   .get()
if(qsnap.empty)return [];
else return qsnap.docs.map((v:{data:Function})=>{
   
  const data= v.data()
  return data

})
}
