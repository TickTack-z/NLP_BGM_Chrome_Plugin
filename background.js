
chrome.tabs.onHighlighted.addListener(function(tabId, changeInfo, tab){
    var myElem = document.getElementById('mp3');
    if (myElem === null) {
        var audio = document.createElement('audio');
        audio.setAttribute("id","mp3");
        audio.src = getAudioUrl();
        document.body.appendChild(audio);
        audio.play();
    } else {}//change audio
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        var myElem = document.getElementById('mp3');
        if (myElem === null) {
            var audio = document.createElement('audio');
            audio.setAttribute("id","mp3");
            audio.src = getAudioUrl();
            document.body.appendChild(audio);
            audio.play();
        } else {}//change audio
    }
});


function getAudioUrl(){
    return 'https://s3.amazonaws.com/12312331231231231232/Ib%E6%81%90%E6%80%96%E7%BE%8E%E6%9C%AF%E9%A6%86+-+Bad+Apple.mp3';
}

console.log("I am background.js");

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting == "play/pause") {
            //switch play/pause
            //return switched state
            var myElem = document.getElementById('mp3');
            var mess_response;
            if (myElem === null) {
            } else{
                if (myElem.paused){
                    myElem.play();
                    mess_response='playing';
                }
                else{
                    myElem.pause();
                    mess_response='paused';
                }
            }
            sendResponse({
                msg: mess_response
            });
        }
        if (request.greeting == "current_state") {
            //return current state
            var myElem = document.getElementById('mp3');
            var mess_response;
            if (myElem === null) {
            } else{
                if (myElem.paused){
                    mess_response='paused';
                }
                else{
                    mess_response='playing';
                }
            }
            sendResponse({
                msg: mess_response
            });
        }
    });