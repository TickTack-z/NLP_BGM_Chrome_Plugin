function displayUser(user) {
    if (user.name){
        console.log(user);
        document.getElementById("fblogin").innerHTML= "Welcome, " + user.name;
        localStorage.userId = user.id;
    }else{
        delete localStorage.accessToken ;
        delete localStorage.userId;
    }
}

window.onload = function(){
    //spark start
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        var http = new XMLHttpRequest();
        var url = "https://hsrccxadaf.execute-api.us-east-1.amazonaws.com/dev/maincontent";
        http.open("POST", url, true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var params = tabs[0].url;
        var message;
        console.log("phase2");
        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                // console.log(http.responseText);
                message = JSON.parse(http.responseText).message;
                //console.log(message);
                console.log("phase1");



                var url2 = "https://hsrccxadaf.execute-api.us-east-1.amazonaws.com/dev/classify";
                var http2 = new XMLHttpRequest();
                http2.open("POST", url2, true);
                http2.setRequestHeader("Content-type", "application/json");
                http2.onreadystatechange = function() {//Call a function when the state changes.
                    console.log("phase3");
                    if (http.readyState == 4 && http.status == 200) {
                        // console.log(http.responseText);
                        //console.log(message);
                        document.getElementById("spark").innerHTML = http2.responseText;
                    }
                }

                http2.send(JSON.stringify({"text":message}));


            }
        }
        http.send(params);



    })

    //spark end




    //map listener
    document.getElementById("map").onclick = function() {
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
                    var temp1 = "http://newsmap.us-east-1.elasticbeanstalk.com/";
                    var newURL =tabs[0].url;
                    newURL=newURL.replace(/\//g,"~");
                    chrome.tabs.create({ url: temp1+newURL });
            }
        )
    }




    chrome.storage.sync.get("emotion",function (item) {
        setEmotions(item.emotion);
    });


    //liked
    chrome.storage.sync.get("mp3",function (item) {
        var element_temp = document.getElementById("like");
        if (localStorage.getItem(item.mp3) != null) {
            element_temp.style.backgroundImage = 'url("pic/heart_liked.png")';

            var log_temp = JSON.parse(localStorage.log);
            log_temp[item.mp3]["like"] = 1;
            localStorage.log = JSON.stringify(log_temp);
        }
        else {
            element_temp.style.backgroundImage = 'url("pic/h_wangyi.png")';


            var log_temp = JSON.parse(localStorage.log);
            log_temp[item.mp3]["like"] = 0;
            localStorage.log = JSON.stringify(log_temp);
        }
    })



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
    var chinese = "富強民主文明和諧自由平等公正法治愛國敬業誠信友善";//"田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄畅畆畇畈畉畊畋界畍畎畏畐畑";
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


    //click like button
    document.getElementById("like").onclick = function(){
        var element = document.getElementById("like");
        if (localStorage.userId){
            chrome.storage.sync.get("mp3",function (item) {
                if (localStorage.getItem(item.mp3) != null){
                    element.style.backgroundImage = 'url("pic/h_wangyi.png")';
                    localStorage.removeItem(item.mp3);

                    var log_temp = JSON.parse(localStorage.log);
                    log_temp[item.mp3]["like"] = 0;
                    localStorage.log = JSON.stringify(log_temp);

                }
                else{
                    localStorage.setItem(item.mp3,1);
                    element.style.backgroundImage = 'url("pic/heart_liked.png")';


                    var log_temp = JSON.parse(localStorage.log);
                    log_temp[item.mp3]["like"] = 1;
                    localStorage.log = JSON.stringify(log_temp);

                }
            });
            /*
        if (element.style.backgroundImage == 'url("pic/heart_liked.png")'){
            element.style.backgroundImage = 'url("pic/h_wangyi.png")';
        }
        else {
            element.style.backgroundImage = 'url("pic/heart_liked.png")';
        }*/
        }
        else{
            alert("please log in your facebook account first");
        }
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

            /*
            if (localStorage.userId) {
                chrome.storage.sync.get("mp3", function (item) {
                    element = document.getElementById("like");
                    if (localStorage.getItem(item.mp3) != null) {
                        element.style.backgroundImage = 'url("pic/heart_liked.png")';
                    }
                    else {
                        element.style.backgroundImage = 'url("pic/h_wangyi.png")';
                    }
                });
            }
            */
        }
        )
    }


    function switch_play_pause() {
        console.log("switch_play_pause");
        chrome.runtime.sendMessage({
                greeting: "play/pause"
            },
            function(response) {
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
            var temp=changes["mp3"].newValue;
                element = document.getElementById("like");
                if (localStorage.getItem(temp) != null) {
                    element.style.backgroundImage = 'url("pic/heart_liked.png")';


                    var log_temp = JSON.parse(localStorage.log);
                    log_temp[item.mp3]["like"] = 1;
                    localStorage.log = JSON.stringify(log_temp);
                }
                else {
                    element.style.backgroundImage = 'url("pic/h_wangyi.png")';


                    var log_temp = JSON.parse(localStorage.log);
                    log_temp[item.mp3]["like"] = 0;
                    localStorage.log = JSON.stringify(log_temp);
                }
        }
        if ("emotion" in changes)
        {
            var temp=changes["emotion"].newValue;
            setEmotions(temp);
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



    function setEmotions(emotions){
        var list_emotion = ["anger", "disgust", "fear", "joy", "sadness"];
        var ele_list = document.getElementsByClassName("skill-bar-percent");
        var ele_list_value=document.getElementsByClassName("skillbar clearfix ");
        for (var i = 0; i < list_emotion.length; i++){
            var temp = parseFloat(emotions[list_emotion[i]]);
            ele_list[i].innerHTML = parseInt((temp*100).toString())+"%";
            var percent = (parseInt(10*Math.sqrt(temp*100))).toString()+"%";
            ele_list_value[i].setAttribute("data-percent",percent);
        }
        jQuery('.skillbar').each(function(){
            jQuery(this).find('.skillbar-bar').animate({
                width:jQuery(this).attr('data-percent')
            },2000);
        });
    }

}

