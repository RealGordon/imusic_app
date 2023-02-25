import { configureStore} from "@reduxjs/toolkit";
import playlistsReducer from '../playlists/playlistsSlice'
import { songsResultsReducer } from "../search/slice";
import sessionReducer from '../sessions/sessionsSlice';
import userReducer  from '../user/userSlice'
import playerReducer from '../player/playerSlice'
import {friendsReducer} from '../messages/friendsSlice'
//const userReducer=userSlice.reducer
const store=configureStore({
    reducer:{
        friends:friendsReducer,
        playlists:playlistsReducer,
        sessions:sessionReducer,
        user:userReducer,
        songs:songsResultsReducer,
        player:playerReducer
    }
})
export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const getRDXUser=(s:RootState)=>s.user.user