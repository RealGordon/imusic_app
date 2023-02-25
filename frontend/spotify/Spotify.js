window.accessToken=undefined;
let expiresIn=null,
userID=null,
userName="",
headers;
const redirectRE=/access_token=([^&]*)[\w&=]*expires_in=([^&]*)/;

const Spotify={
  playTracks:async function(uris){
    const headers={Authorization:"Bearer "+accessToken};
    headers["Content-Type"]="application/json"
    let body={};
    if(uris)body.body=JSON.stringify({uris});
  const method='put';
  const res = await fetch('https://api.spotify.com/v1/me/player/play',
  {headers,method,...body})
  return {songStatus:'play', code:res.status}
   
  },
  nextTrack:async function(dispatch,register){
    const headers={Authorization:"Bearer "+accessToken};
    headers["Content-Type"]="application/json"
  
  const method='post';
  const res = await fetch('https://api.spotify.com/v1/me/player/next',
  {headers,method})
  return {songStatus:'play', code:res.status}
   
  },
  pauseTrack:async function(){
    const headers={Authorization:"Bearer "+accessToken};
     headers["Content-Type"]="application/json"
   
   const method='put';
   const res = await fetch('https://api.spotify.com/v1/me/player/pause',
   {headers,method})
   return {songStatus:'pause', code:res.status} //204 Playback paused
   //429 The app has exceeded its rate limits.
  },
  previousTrack:async function(){
    const headers={Authorization:"Bearer "+accessToken};
    headers["Content-Type"]="application/json"
  
  const method='post';
  const res = await fetch('https://api.spotify.com/v1/me/player/previous',
  {headers,method})
  return {songStatus:'play', code:res.status}
   
  },
   getspotToken:async function(){
   const res= await fetch('https://imusic-api-new.herokuapp.com/api/v1/spotify/token')
   const data=await res.json()
   expiresIn= data.body.expires_in;
   accessToken=data.token
  },
getUserName:function(){
   if(userID || (userID=this.getLocalData("userID")))return Promise.resolve(userName);
  const  endpoint="https://api.spotify.com/v1/me";
  if(headers)delete headers["Content-Type"];
  else return Promise.reject("error no headers");
  return fetch(endpoint,{headers:headers}).then(res=>res.json())
   .then(({id,display_name})=>{
   if(display_name) localStorage.setItem("display_name",display_name);
      localStorage.setItem("userID",id);
  return  ((userID=id),(userName=display_name))})
},
getPlaylistID:function(name){
    if(!userID)return Promise.reject("no user id"); 
    const endpoint=`https://api.spotify.com/v1/users/${userID}/playlists`;
 const body=JSON.stringify({name});
 headers["Content-Type"]="application/json";
return    fetch(endpoint,{method:"POST",headers:headers,body:body})
    .then(res=>res.json()).then(({id})=>id)
},

savePlaylist:async function(name,uris){ 
  
  if(!accessToken) await this.getspotToken();
  
  function postPlaylist(playlistID){
    const  endpoint=`https://api.spotify.com/v1/playlists/${playlistID}/tracks`;
    const body=JSON.stringify({uris});
     headers["Content-Type"]="application/json";
    return fetch(endpoint,{method:"POST",headers:headers,body:body})
     .then(res=>res.json()).then(({snapshot_id})=>snapshot_id)
    }
    
 return  this.getUserName().then(()=>this.getPlaylistID(name))
 .then(id=>postPlaylist(id));

  
  
},
search:async function(term){
    if (!accessToken) accessToken=await  this.getspotToken();
    const headers={Authorization:"Bearer "+accessToken};
    const  endpoint = "https://api.spotify.com/v1/search?limit=10&type=track&q="+term;
    let res;
    try{
     res=await fetch(endpoint,{headers:headers})
    }catch(e){
      console.log(e)
     await  this.getspotToken()
     res=await fetch(endpoint,{headers:headers})
    }
    const json_data= await res.json()

    const items=json_data.tracks?json_data.tracks.items:[];
    if(Array.isArray(items))return items;
    else return [];
   

},
getAccessTime:function(){
return ""+(Date.now()+expiresIn)
},
getLocalData:function(type){
    const accessTime=localStorage.getItem("accessTime");
if(type==="accessToken"){
const accessToken=localStorage.getItem(type);
if(accessToken && accessTime && Date.now()<parseInt(accessTime))return accessToken;

}
else if(type==="userID"){
 const userID=localStorage.getItem(type);
if(userID && accessTime && Date.now()<parseInt(accessTime)){
  return  ((userName=localStorage.getItem("display_name")),userID);
     
}
}
return null
},
getAccessToken:function(){
if (accessToken)  {
    headers={Authorization:"Bearer "+accessToken};
  return  accessToken
}
/*if (accessToken=this.getLocalData("accessToken")){
    headers={Authorization:"Bearer "+accessToken};
    return accessToken;

}*/

const match=window.location.href.match(redirectRE);
if (match){
    window.setTimeout(() =>{
         accessToken = null;
         localStorage.removeItem("accessToken");
         localStorage.removeItem("accessTime");
         localStorage.removeItem("userID");
         localStorage.removeItem("display_name");
        }, (expiresIn=parseInt(match[2]) * 1e3));
        

headers={Authorization:"Bearer "+(accessToken=match[1])};
localStorage.setItem("accessToken", accessToken);
localStorage.setItem("accessTime",this.getAccessTime());
window.history.pushState('Access Token', null, 'index.html');
    return accessToken;
}
let client_id="5dd08e7458a74aedba2bda30267cab34",
//scope="playlist-modify-public",
scope="user-read-playback-state user-modify-playback-state  \
user-read-private \
user-read-currently-playing streaming app-remote-control",
redirect_uri="http://localhost:5000/static/index.html/",
 state = "jhfufghjfhufhvfb"+Math.floor(Math.random()*5e3).toString(16);

sessionStorage.setItem("stateKey", state);
var url = 'https://accounts.spotify.com/authorize';
url += '?response_type=token';
url += '&client_id=' + encodeURIComponent(client_id);
url += '&scope=' + encodeURIComponent(scope);
url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
url += '&state=' + encodeURIComponent(state);
//url += '&show_dialog=true';
//alert("this demo project requires a spotify account");
window.location=url;
},


}
//todo: get local token , check the time


export default Spotify;