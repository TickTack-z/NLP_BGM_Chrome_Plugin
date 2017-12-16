function displayUser(user) {
    if (user.name){
        console.log(user);
        document.getElementById("fblogin").innerHTML= "Welcome, " + user.name;
    }else{
        delete localStorage.accessToken ;
    }
}

window.onload = function(){

    //fb token
    if (localStorage.accessToken) {
        var graphUrl = "https://graph.facebook.com/me?" + localStorage.accessToken + "&callback=displayUser";
        console.log(graphUrl);

        var script = document.createElement("script");
        script.src = graphUrl;
        document.body.appendChild(script);
    }
    //end of facebook token


//rain
    var c = document.getElementById("c");
    var ctx = c.getContext("2d");

//making the canvas full screen
    c.height = window.innerHeight;
    c.width = window.innerWidth;

//chinese characters - taken from the unicode charset
    var chinese = "富强民主文明和谐自由平等公正法治爱国敬业诚信友善";//"田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄畅畆畇畈畉畊畋界畍畎畏畐畑";
//converting the string into an array of single characters
    chinese = chinese.split("");

    var font_size = 10;
    var columns = c.width/font_size; //number of columns for the rain
//an array of drops - one per column
    var drops = [];
//x below is the x coordinate
//1 = y co-ordinate of the drop(same for every drop initially)
    for(var x = 0; x < columns; x++)
        drops[x] = 1;


//drawing the characters
    function draw()
    {
        //Black BG for the canvas
        //translucent BG to show trail
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, c.width, c.height);

        ctx.fillStyle = "#0F0"; //green text
        ctx.font = font_size + "px arial";
        //looping over drops
        for(var i = 0; i < drops.length; i++)
        {
            //a random chinese character to print
            var text = chinese[Math.floor(Math.random()*chinese.length)];
            //x = i*font_size, y = value of drops[i]*font_size
            ctx.fillText(text, i*font_size, drops[i]*font_size);

            //sending the drop back to the top randomly after it has crossed the screen
            //adding a randomness to the reset to make the drops scattered on the Y axis
            if(drops[i]*font_size > c.height && Math.random() > 0.975)
                drops[i] = 0;

            //incrementing Y coordinate
            drops[i]++;
        }
    }


    chrome.runtime.sendMessage({
            greeting: "current_state"
        },
        function(response) {
            if (response.msg == "paused"){
                document.getElementById("div").textContent = response.msg;
                var element = document.getElementById("btn");
                element.style.backgroundImage= 'url("pic/play.jpg")';
            } else if (response.msg == "playing"){
                document.getElementById("div").textContent = localStorage.mp3;
                var element = document.getElementById("btn");
                element.style.backgroundImage= 'url("pic/pause.jpg")';
                setDraw = setInterval(draw,33);
            }
        });


    //click pause/play
    get_current_state();
    document.getElementById("btn").onclick = function(){
        switch_play_pause();
    }

    //click next
    document.getElementById("next").onclick = function(){
        chrome.runtime.sendMessage({
                greeting: "next"
            },
        function(response) {
            if (response.msg == "playing")
            {
                get_current_state();
            }
            else if (response.msg == "paused"){
                switch_play_pause();
            }
        })
    }


    function switch_play_pause() {
        console.log("switch_play_pause");
        chrome.runtime.sendMessage({
                greeting: "play/pause"
            },
            function(response) {
                document.getElementById("div").textContent = response.msg;
                if (response.msg == "paused"){
                    document.getElementById("div").textContent = "paused";
                    clearInterval(setDraw);
                    var element = document.getElementById("btn");
                    element.style.backgroundImage= 'url("pic/play.jpg")';
                } else if (response.msg == "playing"){
                    chrome.storage.sync.get("mp3",function (item) {
                        document.getElementById("div").textContent = item.mp3;
                    });
                    setDraw = setInterval(draw,33);
                    var element = document.getElementById("btn");
                    element.style.backgroundImage= 'url("pic/pause.jpg")';
                }
            });
    }

    function get_current_state() {
        console.log("get current state");
        chrome.runtime.sendMessage({
                greeting: "current_state"
            },
            function(response) {
                if (response.msg == "paused"){
                    document.getElementById("div").textContent = "paused";
                    var element = document.getElementById("btn");
                    element.style.backgroundImage= 'url("pic/play.jpg")';
                } else{
                    chrome.storage.sync.get("mp3",function (item) {
                        document.getElementById("div").textContent = item.mp3;
                    });
                    var element = document.getElementById("btn");
                    element.style.backgroundImage= 'url("pic/pause.jpg")';
                }
            });
    }




    //document.getElementById("div").innerHTML=response.src;
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if ("mp3" in changes)
        {
            document.getElementById("div").innerHTML=changes["mp3"].newValue;
        }

        for (key in changes) {
            var storageChange = changes[key];
            console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
        }
    });


}

