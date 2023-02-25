import {createSlice} from '@reduxjs/toolkit'
type userInterface ={
    email:string,
    displayName?:string,
    uid:string,
    emailVerified:true|false
};
const user:userInterface =null;
const initialState={
    user,
    state:'pending',
    action:'fetch'}
const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        setUser(s,a){

            if(!a.payload.user){
             const  user={uid:createUid()}
             return {...a.payload,user}
            }
            return {...a.payload}
        }
    }
})
export default userSlice.reducer;
export const {setUser}=userSlice.actions
const createUid=()=>{
  return  "jhfufghjfhfb"+Math.floor(Math.random()*5e3).toString(16);
}