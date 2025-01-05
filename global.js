document.addEventListener('DOMContentLoaded', function() {
    goSettingsList();
    LoadStreamers();
    goEventsList();
    goUsersList();
});

function EventsFilter(opt,storage) {
    var cells=document.querySelectorAll('.event-all');
    for(var i=0;i<cells.length;i++){
        var cell=cells[i];
        if(opt==='all'||cell.classList.contains(opt)){
            cell.style.display='';
        }else{
            cell.style.display='none';
        }
    }
    sessionStorage.setItem(storage+"-event-list-show",opt);
    if(opt==='all'){addClass('button-all','active');delClass('button-inv','active');delClass('button-boss','active');delClass('button-evt','active');}
    if(opt==='event'){addClass('button-evt','active');delClass('button-inv','active');delClass('button-boss','active');delClass('button-all','active');}
    if(opt==='boss'){addClass('button-boss','active');delClass('button-inv','active');delClass('button-evt','active');delClass('button-all','active');}
    if(opt==='inv'){addClass('button-inv','active');delClass('button-boss','active');delClass('button-evt','active');delClass('button-all','active');}
}

function LoadEventAlerts(arg1, storageName) {
    AlertEvents = arg1;
    result = AlertEvents.split(",");
    for (i = 0; i < result.length; i++) {
        sessionStorage.setItem(storageName+"-sequential-" + i, result[i]);
    }
    ReloadCharacters(storageName);
}

function LoadCharacters(name, id, handle, title, storageName) {
    var Characters={Code:id,Name:name,Handle:handle,Title:title};
    var data=[];
    var items=localStorage.getItem(storageName+"-Characters");
    if(items==null){
        data.push(Characters);
        localStorage.setItem(storageName+"-Characters",JSON.stringify(data));
    }else{
        var arr=JSON.parse(items);
        var found=false;
        for(var i in arr){
            if(arr[i].Name==name&&arr[i].Code==id){
                arr[i]=Characters;
                found=true;
            }
            data.push(arr[i]);
        }
        if(!found){
            data.push(Characters);
        }
        localStorage.setItem(storageName+"-Characters",JSON.stringify(data));
    }
    PrintCharacters(storageName);
    return true;
}

function ReloadCharacters(storageName) {
    if(window.chrome&&window.chrome.webview){
        window.chrome.webview.postMessage({functionId:6,args:[storageName]});
    }
}

function ClearCharacters(storageName) {
    localStorage.removeItem(storageName+'-Characters');
    document.getElementById('load-characters').innerHTML="";
}

function goCareer(name) {
    var CharName=utf8_to_b64(name);
    $('#career-frame').attr({'src':url+'level-rewards/dash-reward/'+CharName});
    setTimeout(function(){
        goCareerFrame();
    },1000);
}

function PrintCharacters(storageName) {
    var obj=JSON.parse(localStorage.getItem(storageName+'-Characters'));
    $('#load-characters').html('');
    for(var prop in obj){
        var obj2=obj[prop];
        var name=obj2.Name.replace('[','').replace(']','');
        var level=obj2.Title;
        var hasResets=false;
        var search='Name: ['+name+']';
        level=level.substring(level.indexOf(search)+search.length);
        if(level.indexOf("Resets")!==-1){
            hasResets=true;
        }
        level=level.replace('Level:','Lv:').replace('[','').replace(']','').replace(' ,',',');
        level=level.replace('Master Level:',', mL:').replace('[','').replace(']','').replace(' ,',',');
        level=level.replace('Resets:',', R:').replace('[','').replace(']','').replace(' ,',',');
        var getLevel=level.split(' ');
        var clevel=getLevel[2].replace(',','');
        var mlevel=getLevel[4].replace(',','');
        var resets='0';
        if(hasResets){
            resets=getLevel[6].replace(',','');
        }
        var button='<span style="display:none;" id="clevel-'+name+'">'+clevel+'</span><span style="display:none;" id="mlevel-'+name+'">'+mlevel+'</span><span style="display:none;" id="reset-'+name+'">'+resets+'</span><button onclick="ChangeStatusWindow(7,\''+name+'\','+obj2.Code+','+obj2.Handle+','+clevel+','+mlevel+','+resets+');"><i class="fa fa-window-maximize" aria-hidden="true"></i></button>';
        $('#load-characters').append('<tr id="tr-'+name+'"><td><div><table><tr><td style="width:57%;padding-top:4px;"><span style="padding-top:5px;">'+name+'</span></td><td rowspan="2" id="buttons-'+name+'">'+button+'</td></tr><tr><td><p style="margin-top:0px;font-size:9px;color:#999;float:left;" id="level-'+name+'">'+level+'</p></td></tr></table></div></td></tr>');
        document.getElementById('buttons-'+name).innerHTML=button;
        document.getElementById('level-'+name).innerHTML=level;
    }
}

function ChangeStatusWindow(code,name,id,handle,clevel,mlevel,resets) {
    var uniqueId=name;
    var level='Lv: '+clevel+' mL: '+mlevel;
    if(resets>0){level+=' R: '+resets;}
    document.getElementById('level-'+uniqueId).innerHTML=level;
    var button='<span style="display:none;" id="clevel-'+uniqueId+'">'+clevel+'</span><span style="display:none;" id="mlevel-'+uniqueId+'">'+mlevel+'</span><span style="display:none;" id="reset-'+uniqueId+'">'+resets+'</span><button onclick="ChangeStatusWindow(7,\''+name+'\','+id+','+handle+','+clevel+','+mlevel+','+resets+');"><i class="fa fa-window-maximize" aria-hidden="true"></i></button>';
    document.getElementById('buttons-'+uniqueId).innerHTML=button;
    if(window.chrome&&window.chrome.webview){
        window.chrome.webview.postMessage({functionId:7,args:[code,name,id,handle]});
    }
}

function closeClientOnDash(code,name,id,handle) {
    if(code==9){
        if(window.chrome&&window.chrome.webview){
            window.chrome.webview.postMessage({functionId:9,args:[code,name,id,handle]});
        }
    }
    if(code==10){
        if(window.chrome&&window.chrome.webview){
            window.chrome.webview.postMessage({functionId:9,args:[code,name,id,handle]});
        }
        $('#tr-'+name+'').remove();
    }
}

function ChangeStatusAlert(id,storageName) {
    if(document.getElementById("event-"+id)&&document.getElementById("event-"+id).classList.contains('fa-volume-up')){
        sessionStorage.setItem(storageName+"-sequential-"+id,0);
        if(window.chrome&&window.chrome.webview){
            window.chrome.webview.postMessage({functionId:3,args:[id,0]});
        }
    }else{
        sessionStorage.setItem(storageName+"-sequential-"+id,1);
        if(window.chrome&&window.chrome.webview){
            window.chrome.webview.postMessage({functionId:3,args:[id,1]});
        }
    }
}

function goUsersList(storage) {
    var users_list=document.getElementById("users-list");
    var streamers_list=document.getElementById("streamers-list");
    var events_list=document.getElementById("events-list");
    var news_list=document.getElementById("news-list");
    var settings_list=document.getElementById("settings-list");
    var career_frame=document.getElementById("career-frame");
    streamers_list.style.display="none";
    news_list.style.display="none";
    events_list.style.display="none";
    settings_list.style.display="none";
    career_frame.style.display="none";
    users_list.style.display="block";
    delClass('button-news','active');
    delClass('button-streamers','active');
    delClass('button-events','active');
    addClass('button-users','active');
}

function goEventsList(storage) {
    sessionStorage.setItem(storage+"-event-list-show",'all');
    var users_list=document.getElementById("users-list");
    var streamers_list=document.getElementById("streamers-list");
    var events_list=document.getElementById("events-list");
    var news_list=document.getElementById("news-list");
    var settings_list=document.getElementById("settings-list");
    var career_frame=document.getElementById("career-frame");
    streamers_list.style.display="none";
    news_list.style.display="none";
    users_list.style.display="none";
    settings_list.style.display="none";
    career_frame.style.display="none";
    events_list.style.display="block";
    delClass('button-news','active');
    delClass('button-streamers','active');
    delClass('button-users','active');
    addClass('button-events','active');
}

function goNewsList() {
    var users_list=document.getElementById("users-list");
    var streamers_list=document.getElementById("streamers-list");
    var events_list=document.getElementById("events-list");
    var news_list=document.getElementById("news-list");
    var settings_list=document.getElementById("settings-list");
    var career_frame=document.getElementById("career-frame");
    events_list.style.display="none";
    streamers_list.style.display="none";
    users_list.style.display="none";
    settings_list.style.display="none";
    career_frame.style.display="none";
    news_list.style.display="block";
    delClass('button-events','active');
    delClass('button-streamers','active');
    delClass('button-users','active');
    addClass('button-news','active');
}

function goStreamersList() {
    var users_list=document.getElementById("users-list");
    var streamers_list=document.getElementById("streamers-list");
    var events_list=document.getElementById("events-list");
    var news_list=document.getElementById("news-list");
    var settings_list=document.getElementById("settings-list");
    var career_frame=document.getElementById("career-frame");
    events_list.style.display="none";
    news_list.style.display="none";
    users_list.style.display="none";
    settings_list.style.display="none";
    career_frame.style.display="none";
    streamers_list.style.display="block";
    delClass('button-events','active');
    delClass('button-news','active');
    delClass('button-users','active');
    addClass('button-streamers','active');
}

function goSettingsList() {
    var users_list=document.getElementById("users-list");
    var streamers_list=document.getElementById("streamers-list");
    var events_list=document.getElementById("events-list");
    var news_list=document.getElementById("news-list");
    var settings_list=document.getElementById("settings-list");
    var career_frame=document.getElementById("career-frame");
    events_list.style.display="none";
    news_list.style.display="none";
    users_list.style.display="none";
    streamers_list.style.display="none";
    career_frame.style.display="none";
    settings_list.style.display="block";
    delClass('button-events','active');
    delClass('button-news','active');
    delClass('button-users','active');
    delClass('button-streamers','active');
}

function goCareerFrame() {
    var users_list=document.getElementById("users-list");
    var streamers_list=document.getElementById("streamers-list");
    var events_list=document.getElementById("events-list");
    var news_list=document.getElementById("news-list");
    var settings_list=document.getElementById("settings-list");
    var career_frame=document.getElementById("career-frame");
    events_list.style.display="none";
    news_list.style.display="none";
    users_list.style.display="none";
    streamers_list.style.display="none";
    settings_list.style.display="none";
    career_frame.style.display="block";
    delClass('button-events','active');
    delClass('button-news','active');
    delClass('button-users','active');
    delClass('button-streamers','active');
}

function newEffectsClient() {
    document.getElementById("new-effect").checked=true;
}

function addClass(id,classe) {
    var elemento=document.getElementById(id);
    if(!elemento)return;
    var classes=elemento.className.split(' ');
    if(classes.indexOf(classe)===-1){
        classes.push(classe);
        elemento.className=classes.join(' ');
    }
}

function delClass(id,classe) {
    var elemento=document.getElementById(id);
    if(!elemento)return;
    var classes=elemento.className.split(' ');
    var i=classes.indexOf(classe);
    if(i>-1){
        classes.splice(i,1);
    }
    elemento.className=classes.join(' ');
}

document.onselectstart=new Function("return false");
document.oncontextmenu=new Function("return false");
if(window.sidebar){
    document.onmousedown=function(){return false};
    document.onclick=function(){return true};
}

var clientId='cirsf6g94lpzogfcr6ftqdqfcmhwqk';
var token='igon7fhx0l3tu4rmcgszeozdf9o73v';

function LoadStreamers() {
    $.ajax({
        type:'GET',
        url:'fetch_streamers.php',
        dataType:'json',
        success:function(data){
            displayStreams();
            checkOnlineStatus(data);
        }
    });
}

function checkOnlineStatus(streamers) {
    var streamerNames=[];
    for(var i=0;i<streamers.length;i++){
        streamerNames.push(streamers[i].name);
    }
    if(streamerNames.length===0){
        return;
    }
    $.ajax({
        type:'GET',
        url:'twitch_proxy.php',
        data:{'user_login[]':streamerNames},
        headers:{
            'Client-ID':clientId,
            'Authorization':'Bearer '+token
        },
        success:function(response){
            var data=JSON.parse(response);
            displayOnlineStreamers(data.data);
        }
    });
}

function displayOnlineStreamers(onlineStreamers) {
    var streamersList='';
    if(onlineStreamers.length===0){
        streamersList='<div>No streamers are online</div>';
    }else{
        for(var i=0;i<onlineStreamers.length;i++){
            var streamer=onlineStreamers[i];
            streamersList+='<tr><td><div><table><tr><td><a href="https://www.twitch.tv/'+streamer.user_login+'" target="_blank" style="color:white;font-weight:bold;">'+streamer.user_name+'</a></td><td style="color:green;font-weight:bold;">ONLINE</td></tr></table></div></td></tr>';
        }
    }
    $("#streamers-list").html('<table>'+streamersList+'</table>');
}

function utf8_to_b64(str){return window.btoa(unescape(encodeURIComponent(str)));}

function displayStreams() {
    document.getElementById("button-streamers").style.display="block";
}

function sendCharactersToCSharp(storageName) {
    var characters=getCharacters(storageName);
    var jsonCharacters=JSON.stringify(characters);
    if(window.chrome&&window.chrome.webview){
        window.chrome.webview.postMessage({functionId:13,args:[storageName,jsonCharacters]});
    }
}

function getCharacters(storageName) {
    var items=localStorage.getItem(storageName+"-Characters");
    return items?JSON.parse(items):[];
}

$(document).ready(function(){
    setInterval(function(){
        LoadStreamers();
    },120000);
    setInterval(function(){
        ReloadCharacters(storage);
    },5000);
    sessionStorage.setItem(storage+"-event-list-show",'all');
});
