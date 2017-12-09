console.log("I am popup.js");
get_current_state();

document.getElementById("btn").onclick = function(e){
    switch_play_pause();
}

function switch_play_pause() {
    console.log("switch_play_pause");
    chrome.runtime.sendMessage({
            greeting: "play/pause"
        },
        function(response) {
            document.getElementById("div").textContent = response.msg;
        });
}

function get_current_state() {
    console.log("get current state");
    chrome.runtime.sendMessage({
            greeting: "current_state"
        },
        function(response) {
            document.getElementById("div").textContent = response.msg;
        });
}
