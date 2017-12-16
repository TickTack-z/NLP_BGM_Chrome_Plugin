//facebook login
var successURL = 'https://www.facebook.com/connect/login_success.html';
window.onload = function(){
    audio = document.createElement("audio");
    audio.src =  "https://s3.amazonaws.com/12312331231231231232/Ib%E6%81%90%E6%80%96%E7%BE%8E%E6%9C%AF%E9%A6%86+-+Bad+Apple.mp3";
    audio.setAttribute("id","mp3");
    document.body.appendChild(audio);
}



function onFacebookLogin() {
    if (!localStorage.accessToken) {
        chrome.tabs.getAllInWindow(null, function(tabs) {
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].url.indexOf(successURL) == 0) {
                    var params = tabs[i].url.split('#')[1];
                    access = params.split('&')[0]
                    console.log(access);
                    localStorage.accessToken = access;
                    chrome.tabs.onUpdated.removeListener(onFacebookLogin);
                    return;
                }
            }
        });
    }
}
chrome.tabs.onUpdated.addListener(onFacebookLogin);
//end of fb login

chrome.tabs.onHighlighted.addListener(function(){
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        getAudioUrl(tabs[0].url, new_music);
        }
)}
);

/*
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        var myElem = document.getElementById('mp3');
        if (myElem === null) {
            var audio = document.createElement('audio');
            audio.setAttribute("id","mp3");
            audio.src = getAudioUrl();
            document.body.appendChild(audio);
        } else {}//change audio
    }
});
*/


function getAudioUrl(current_url , callback){
    //return 'https://s3.amazonaws.com/12312331231231231232/Ib%E6%81%90%E6%80%96%E7%BE%8E%E6%9C%AF%E9%A6%86+-+Bad+Apple.mp3';
    var http = new XMLHttpRequest();
    var url = "https://hsrccxadaf.execute-api.us-east-1.amazonaws.com/dev/nlp";
    var params = current_url;
    http.open("POST", url, true);

//Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            //alert(http.responseText)
            var temp=JSON.parse(http.responseText);
            var urlMusic = temp.urlMusic;
            var emotions = temp.emtions;
            callback(urlMusic);
        }
    }
    http.send(params);
}

function new_music(new_music_url){
    var myElem = document.getElementById('mp3');
    if (myElem.paused){
        myElem.src=new_music_url;
    }
    else {
        myElem.src=new_music_url;
        myElem.play();

    }

}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting == "play/pause") {

            //switch play/pause
            //return switched state
            var myElem = document.getElementById('mp3');
            var mess_response;
            if (myElem.paused){
                myElem.play();
                mess_response='playing';
            }
            else{
                myElem.pause();
                mess_response='paused';
            }
            sendResponse({
                msg: mess_response
            });
        }
        if (request.greeting == "current_state") {
            //return current state
            var myElem = document.getElementById('mp3');
            var mess_response;
            if (myElem.paused){
                mess_response='paused';
            }
            else{
                mess_response='playing';
            }
            sendResponse({
                msg: mess_response
            });
        }
    });


