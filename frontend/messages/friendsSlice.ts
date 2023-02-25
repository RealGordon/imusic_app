import { async } from "@firebase/util";
import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";

import { getFriendDetailsFire, searchFriendsFire, sendMessageFire } from "./firestore";
interface friendsSliceInterface {
searchResults:any[],
apiLoading:{state:'rejected'|'fulfilled'|'pending'|'idle',
id:string|null,

}
messages:{
    [partner:string]:{status:string,newCount?:number,messages:any[]}
},
readStatus:{status:'seen'|'new',count:number}
partner:string,
partners:any[]
}

const initialState:friendsSliceInterface={
    apiLoading:{state:'idle',
id:null,

},
readStatus:{status:'seen',count:0},
partner:null,
partners:[],
messages:{},
    searchResults:[]}
const slice =createSlice({
name:'friends',
initialState,
reducers:{
    changePartner(s,a){
        const {uid,displayName,email}=a.payload  
        s.partner=uid
        const partner=s.partners.find(v=>v.uid===uid)
        if(!partner && displayName){
            s.partners.push({uid,displayName})
        }
    }
    ,
    readMarkMessages(s,a){
        const partner=a.payload
       const chat= s.messages[partner]
       chat.status='seen'
    },
    getMessages(s,a){
        const userID=a.payload.uid
        const newMessages=a.payload.messages
    newMessages.forEach((m:any) => {
       const partner= m.members.find((v:any)=>v!==userID)
      let chat= s.messages[partner];
      if(!chat){ 
        chat={messages:[],
        status:'new'}
        s.messages[partner]=chat
    }
   // chat.messages.find(v=>v.date===null && v.text===m.message)
    chat.messages.push(m)
    chat.newCount=chat.newCount+1
    if(s.readStatus.status!=='new')s.readStatus.status='new';
    s.readStatus.count=s.readStatus.count+1
    });
    }
},
extraReducers:(b)=>{
    b.addCase(searchFriendsThunk.fulfilled,(s,a)=>{
        s.searchResults=a.payload
    }).addCase(getFriendDetailsThunk.fulfilled,(s,a)=>{
        if(a.payload.length){
        s.partners.push(a.payload[0])
    }
    }).addMatcher((a)=>{
      const index= a.type.indexOf('fire')
      return index!==-1  
       
    },(s,a)=>{
        s.apiLoading.id=a.meta.requestId
        s.apiLoading.state=a.meta.requestStatus
    })
}
})
export const friendsReducer=slice.reducer
export const {getMessages,changePartner}=slice.actions
export const searchFriendsThunk=createAsyncThunk('search/friends/fire',
async(email:string)=>{
return await searchFriendsFire(email)
})

export const sendMessageThunk=createAsyncThunk('send/message/fire',
async(message:any)=>{
return await sendMessageFire(message)
})
export const getFriendDetailsThunk=createAsyncThunk(
    'get/friendDetails/fire',
async(uid:string)=>{
return await getFriendDetailsFire(uid)
})
