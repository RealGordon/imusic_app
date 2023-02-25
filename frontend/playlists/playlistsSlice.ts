import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import { changePlaylistPropsFire, getFireplaylists, savePlaylistFire } from './firestore';
import type {RootState} from '../app/store'
import { setUser } from '../user/userSlice';
import { getSessionPlaylist } from '../sessions/sessionsSlice';

export type playlistsObjectType={
name:string;
 id?:string;
songs:any[]|null;
owner?:string;
sessions?:string[]
}
export type playlistsObjectProps={
    name?:string;
     id?:string;
    songs?:any[]|null;
    owner?:string;
    sessions?:string[]
    }

interface playlistSliceInterface {
    current:'list' | 'new'| string |null,
    
        list:playlistsObjectType[]|null,
        intermediate:playlistsObjectType,
        currentStatus:'edited'|'new'|'saved'|'not saved'|null;
        apiLoading:'idle'|'pending'|'ff'|'rejected'
}
const initialState: playlistSliceInterface={
    current:'list',
    list:[],
    intermediate:null,
    
    currentStatus:null,
    apiLoading:'idle'
}
const slice=createSlice({
    name:'playlists',
    initialState,
    extraReducers:(builder)=>{
        builder.addCase(getPlaylists.fulfilled,(s,a)=>{
           
            s.list=[...a.payload]
            
        }).addCase(savePlaylistThunk.fulfilled,(s,a)=>{
            s.apiLoading='ff'
            if(a.payload){
            if(s.current==='new'){
            s.list.push({...a.payload})
            s.current=a.payload.id
            }
            else {
            s.list=s.list.filter(v=>v.id!==a.payload.id)
            s.list.push(a.payload)
            }
            s.intermediate={...a.payload}
            s.currentStatus='saved'
            }

        }).addCase(savePlaylistThunk.pending,(s)=>{
            s.apiLoading='pending'
        }).addCase(savePlaylistThunk.rejected,(s)=>{
            s.apiLoading='rejected'
            s.currentStatus='not saved'
        }).addCase(getSessionPlaylist.fulfilled,(s,a)=>{
           const p= s.list.find(p=>p.id===a.payload.id)
               if(!p) s.list.push({...a.payload})
        }).addCase(changePlaylistProps.fulfilled,(s,a)=>{
            //only name change props
            if(a.payload.id==='new'){ 
                s.intermediate={...s.intermediate,...a.payload.props}
            }
            else {
             let playlist=s.list.find(v=>v.id===a.payload.id)
             s.list=s.list.filter(v=>v.id!==a.payload.id)
             playlist={...playlist,...a.payload.props}
             s.list.push(playlist)
            }
            //for edited names of playlists
            s.intermediate={...s.intermediate,...a.payload.props}
        })
           }
,        
    reducers:{
        changeCurrentPlyl(s,a){
            s.current=a.payload
            s.currentStatus=null
            s.intermediate=null
            if(a.payload==='new'){
                s.intermediate={
                        name:'My playlist',
                        songs:[],
                        
                }
                s.currentStatus='new'
            }
            else if(a.payload!=='list') {
                const playlist=s.list.find(v=>v.id===a.payload)
                s.intermediate={...playlist,
                    songs:[...playlist.songs]}
            }
            if(a.payload==='edited'){
                s.currentStatus='edited'
            }
        },
        playlistsAdded(s,a){
            if(Array.isArray(a.payload)){
             s.list=a.payload
            }
            else s.list.push(a.payload)
        },
        addSongToInterPlylt(s,a){
            if(!s.intermediate.songs.find(v=>v.uri===a.payload.uri)){
            s.intermediate.songs.push({...a.payload})
                if(s.current!=='new' && s.currentStatus!=='edited'){
                    s.currentStatus='edited'
                }
        }
        },
        removePlaylistSong(s,a){
            s.intermediate.songs=s.intermediate.songs.filter(v=>v.uri!==a.payload)
            if(s.current!=='new' && s.currentStatus!=='edited'){
                s.currentStatus='edited'
            }
        }
    }
  
})
export const {playlistsAdded,removePlaylistSong,
    changeCurrentPlyl,addSongToInterPlylt}=slice.actions
export default slice.reducer
const playlistsSelector=(s:RootState)=>s.playlists.list
const getCurrentPlaylist=(s:RootState)=>s.playlists.current
const getInterPlaylist=(s:RootState)=>s.playlists.intermediate 
export {playlistsSelector,getCurrentPlaylist,getInterPlaylist}

export const getPlaylists=createAsyncThunk('playlists/fetch',
/**
 * 
 * @param {string} uid 
 * @returns 
 */
async (uid:string)=>{
    return await getFireplaylists(uid)
    })

export const  savePlaylistThunk=createAsyncThunk('playlists/saveFirestore',
async (data:{playlist:playlistsObjectType},{getState})=>{
    const root:RootState=getState()
           const user=root.user.user    
return savePlaylistFire({...data,user})
        }
    )
export const getRDXPlaylists=(s:RootState)=>s.playlists.list


export const changePlaylistProps=createAsyncThunk(
    'playlist/props/fire',
async (args:{id:string,props:playlistsObjectProps},{getState})=>{
const root:RootState=getState()
const {current}=root.playlists
if (current==='new'){
    return args
}
else return await changePlaylistPropsFire(args)
})