//facebook login
var successURL = 'https://www.facebook.com/connect/login_success.html';
window.onload = function(){
    audio = document.createElement("audio");
    audio.src =  "https://s3.amazonaws.com/emotion-music/joy/joy1.mp3";
    audio.setAttribute("id","mp3");
    document.body.appendChild(audio);

    chrome.storage.sync.set({'mp3': reg(document.getElementById("mp3").src) }, function() {
        // Notify that we saved.
    });

    localStorage.log="{}";

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
        var myElem = document.getElementById('mp3');
        if (myElem.paused) {
        } else{
            getAudioUrl(tabs[0].url, new_music);
        }
        }
)}
);

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
                var myElem = document.getElementById('mp3');
                if (myElem.paused) {
                } else{
                    getAudioUrl(tabs[0].url, new_music);
                }
            }
        )
    }
});


function getAudioUrl(current_url , callback){
    //return 'https://s3.amazonaws.com/12312331231231231232/Ib%E6%81%90%E6%80%96%E7%BE%8E%E6%9C%AF%E9%A6%86+-+Bad+Apple.mp3';
    var http = new XMLHttpRequest();
    var url = "https://hsrccxadaf.execute-api.us-east-1.amazonaws.com/dev/nlp";
    var params;
    if (localStorage.getItem("userId") !=null ) {
       params = JSON.stringify({URL: current_url, UserID: localStorage.userId});
    } else{
        params = JSON.stringify({URL: current_url,UserID: "XX"});
    }

    http.open("POST", url, true);

//Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            //alert(http.responseText)
            var temp=JSON.parse(http.responseText);
            var urlMusic = temp.urlMusic;
            var emotions = temp.emotions;
            //update emotions:
            chrome.storage.sync.set({'emotion': emotions},function(){});

            callback(urlMusic);
        }
    }
    try {
        http.send(params);
    }
    catch(err){
        //update emotions to N.A.
        chrome.storage.sync.set({'emotion': {
            "anger": 0,
            "disgust":0,
            "fear": 0,
            "joy": 0 ,
            "sadness":0
        }},function(){});

    }
}

function new_music(new_music_url){
    var myElem = document.getElementById('mp3');
    var log_temp ;
    if (localStorage.getItem("log") != null) {
        log_temp = JSON.parse(localStorage.log);
        if (reg(new_music_url) in log_temp) {
            log_temp[reg(new_music_url)]["count"] += 1
        }
        else {
            log_temp[reg(new_music_url)]={};
            log_temp[reg(new_music_url)]["count"] = 1;
            log_temp[reg(new_music_url)]["like"] = 0;
            log_temp[reg(new_music_url)]["next"] = 0;
        }
    }
    localStorage.log = JSON.stringify(log_temp);

    if (myElem.paused){
        myElem.src=new_music_url;
    }
    else {
        myElem.src=new_music_url;
        myElem.play();
    }
    chrome.storage.sync.set({'mp3': reg(document.getElementById("mp3").src) }, function() {
        // Notify that we saved.
    });

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
            var myElem_src = reg(myElem.src);
            if (myElem.paused){
                mess_response='paused';
            }
            else{
                mess_response='playing';
            }
            sendResponse({
                msg: mess_response,
                src: myElem_src
            });
        }
        if (request.greeting == "next") {
            //return current state
            var myElem = document.getElementById('mp3');
            var string_temp=myElem.src;


            //get log data
            var log_temp = JSON.parse(localStorage.log);
            if (reg(string_temp) in log_temp){
                log_temp[reg(string_temp)]["next"] += 1;
            }
            localStorage.log = JSON.stringify(log_temp);

            //send request to online service
            //send to lambda
            if (Object.keys(log_temp).length >=10){
                //调用lambda，上传log
                if (localStorage.getItem("userId") !=null ){
                    var temp = (localStorage.userId).toString();
                    var param ={};
                    param[temp]=log_temp;
                    param = JSON.stringify(param);




                    var http = new XMLHttpRequest();
                    var url = "https://hsrccxadaf.execute-api.us-east-1.amazonaws.com/dev/storeliked";
                    var params = param;
                    http.open("POST", url, true);

                    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

                    http.onreadystatechange = function() {//Call a function when the state changes.
                        if(http.readyState == 4 && http.status == 200) {
                            //alert(http.responseText)
                            localStorage.log="{}";
                        }
                    }
                    http.send(params);




                }
            }









            var status = myElem.paused;
            var new_num=((parseInt(string_temp.slice(-5,-4)))%4)+1;
            var new_str = string_temp.slice(0,-5)+ new_num.toString() + '.mp3';
            new_music(new_str);
            if (status){
                mess_response='paused';
            }
            else{
                mess_response='playing';
            }
            sendResponse({
                msg: mess_response,
                music: reg(new_str)
            });
        }
    });


function reg(url){
    const regex = /\/\/.+\/.+\/.+\/(.+).mp3/g;
    var myArray = regex.exec(url);
    var res=myArray[1];
    return res;
}};



