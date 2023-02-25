import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "../app/store";
import { changeSessPropsFire, getFireActivePlaylist, getFireSessions,joinSession,LeaveSession,saveSessionFire } from "./firestore";
import {playlistsObjectType} from '../playlists/playlistsSlice'

export type sessionObjectType= {
    id?:string;
    name:string;
    privacy:'public'|'private';
    img?:null|undefined|String;
    participants?:number;
    activeStatus?:'ongoing'|'stopped'
    playlistId:string[];
    owner:string,
    live_members?:string[]

}
export type sessionObjectProps= {
    id?:string;
    name?:string;
    privacy?:'public'|'private';
    img?:null|undefined|String;
    participants?:number;
    activeStatus?:'ongoing'|'stopped'
    playlistId?:string[];
    owner?:string,
    live_members?:string[]

}
interface sessionsSliceInterface {
    display:'list'|'active_session',
    current:'new'|'list'|string|null,
    list:sessionObjectType[],
    intermediate:null|sessionObjectType,
    currentPlaylist?:playlistsObjectType|null,
    currentStatus:'new'|'not saved'|'saved'|null,
    apiLoading:'idle'|'pending'|'rejected'|'ff'|'fulfilled',
    activeSession?:string
}

const list: sessionObjectType[]=[];
const initialState:sessionsSliceInterface={
    display:'list',
    current:null,
    list,
    intermediate:null,
    currentStatus:null,
    currentPlaylist:null,
    apiLoading:'idle',
    activeSession:null
}
const slice=createSlice({
    name:'sessions',
    initialState,
    
    extraReducers:(builder)=>{
        builder.addCase(getSessions.fulfilled,(s,a)=>{
            s.list=a.payload
        }).addCase(saveSessionThunk.fulfilled,(s,a)=>{
            s.apiLoading='ff'
            if(a.payload){
            
            s.list.push({...a.payload})
            s.intermediate=null
            s.current=a.payload.id
            s.currentStatus='saved'
            }

        }).addCase(saveSessionThunk.pending,(s)=>{
            s.apiLoading='pending'
        }).addCase(saveSessionThunk.rejected,(s)=>{
            s.apiLoading='rejected'
            s.currentStatus='not saved'
        }).addCase(joinSessThunk.fulfilled,(s,a)=>{
            s.activeSession=a.payload
        }).addCase(getSessionPlaylist.fulfilled,(s,a)=>{
                s.currentPlaylist=a.payload
        }).addCase(leaveSessThunk.fulfilled,(s,a)=>{
            if(s.activeSession===a.meta.arg.old_session){
            s.activeSession=null
        }
        }).addCase(changeSessProps.fulfilled,(s,a)=>{
                if(a.payload.id==='new'){ 
                    s.intermediate={...s.intermediate,...a.payload.props}
                }
                else {
                 let session=s.list.find(v=>v.id===a.payload.id)
                 s.list=s.list.filter(v=>v.id!==a.payload.id)
                 session={...session,...a.payload.props}
                 s.list.push(session)
                }
        })
        .addMatcher((a)=>{
           const index =a.type.indexOf('firestore')
           return index!==-1
        },(s,a)=>{
            s.apiLoading=a.meta.requestStatus
        })
    },
    reducers:{
        getLiveSessions(s,a){
            const livechanges=a.payload
            livechanges.forEach((change:any)=>{
 const session:sessionObjectType= s.list.find(
    (v:sessionObjectType)=>v.id===change.id)
if(session){            
const new_session={...session,live_members:[...change.participants]}
s.list= s.list.filter(v=>v.id!==session.id)
s.list.push(new_session)
}

            })

        },
        sessionsAdded(s,a){
            if(Array.isArray(a.payload)){
                s.list=a.payload
            }
            else s.list.push(a.payload)
        },
        changeCurrentSess(s,a){

            s.current=a.payload.id
            s.intermediate=null;
            s.display='active_session'
            if(a.payload.id==='new'){
            s.intermediate={
                name:'my new session',
                playlistId:[a.payload.playlist],
                privacy:'public',
                owner:a.payload.user.uid

            }
            s.currentStatus='new'
            s.display='active_session'
        }
        },
        changeSessionDisp(s,a){
                s.display=a.payload
               
        },
      

    }
})

export default slice.reducer
export const {sessionsAdded,changeCurrentSess,
    getLiveSessions,
    changeSessionDisp}=slice.actions
export const getReduxSessions=(s:RootState)=>s.sessions.list
export const getInterSessions=(s:RootState)=>s.sessions.intermediate
export const changeSessProps=createAsyncThunk('sessions/props/fire',
async (args:{id:string,props:sessionObjectProps},{getState})=>{
const root:RootState=getState()
const {current}=root.sessions
if (current==='new'){
    return args
}
else return await changeSessPropsFire(args)
})
export const getSessions=createAsyncThunk('sessions/fetch/fire',

async (_,{getState})=>{
    const root:RootState=getState();
        
    return  await  getFireSessions(root.user.user)
    })

export const getCurrentSession=(s:RootState)=>s.sessions.current

export const  saveSessionThunk=createAsyncThunk('sessions/saveFirestore',
/**
 * 
 * @param {{session:sessionObjectType}} data 
 * @returns 
 */    
async (data:{session:sessionObjectType},{getState})=>{
    const root:RootState=getState()
    return saveSessionFire({...data,
    user:root.user.user
    })
            }
        )

export const joinSessThunk=createAsyncThunk('sessions/Join/Firestore',
/**
 * 
 * @param {{new_session:string}} args 
 * @returns 
 */
async (args:{new_session:string},{dispatch,getState})=>{
    const root:RootState=getState()
    const old_session=root.sessions.activeSession
    if(old_session){
    dispatch(leaveSessThunk({old_session}))
    }
   
   
   const new_session=await joinSession({...args,
    old_session:null,
    user:root.user.user,
    })
    dispatch(getSessionPlaylist(new_session))
    return new_session
})
export const leaveSessThunk=createAsyncThunk('sessions/Leave/Firestore',
/**
 * 
 * @param {{old_session:string}} args 
 * @returns 
 */
async (args:{old_session:string},{dispatch,getState})=>{
    const root:RootState=getState()

   return await LeaveSession({
    old_session: args.old_session,
    user:root.user.user,
    })
})

export const getSessionPlaylist=createAsyncThunk(
    'sessions/get/activePlaylist',
    /**
     * 
     * @param {string} session_id 
     * @returns 
     */
    async (session_id:string,{getState})=>{
const root:RootState=getState()
const get_ID=()=>{
  const session:sessionObjectType =  root.sessions.list.find((v:sessionObjectType) =>{
        return v.id===session_id 
     })
  return  session.playlistId[0]
    
    }
return await getFireActivePlaylist({

playlist_id:get_ID(),
uid:root.user.user,
session_id
})
})