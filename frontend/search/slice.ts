import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addSongToInterPlylt } from "../playlists/playlistsSlice";
import Spotify from '../spotify/Spotify';


 interface sonsgsSliceInterface {
    results:null | any[];
    state:'idle'|'pending'|'fulfilled'|'rejected'
 }
const initialState:sonsgsSliceInterface ={results:null,state:'idle'}
const songsSlice=createSlice({
    name:'songs-results',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{

builder.addCase(getSongs.fulfilled,(s,a)=>{
s.state='fulfilled'

s.results=[...a.payload]
}).addCase(getSongs.pending,(s)=>{
    s.state='pending'
}).addCase(getSongs.rejected,(s)=>{
s.state='rejected'
s.results=null
}).addCase(addSongToInterPlylt ,(s,a)=>{
    s.results=s.results.filter(v=>v.uri!== a.payload.uri)
 })
    }

})

export const getSongs=createAsyncThunk('songs/fetch',async (term:string)=>{
return await Spotify.search(term)
})

export const {songsResultsReducer,
   }={songsResultsReducer:songsSlice.reducer,

}


