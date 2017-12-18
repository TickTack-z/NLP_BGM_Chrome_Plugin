
//var mysql = require('mysql');
var apigClientFactory = require('aws-api-gateway-client').default;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;





exports.handler = (event, context, callback) => {

    var http = new XMLHttpRequest();
    var url = "https://hsrccxadaf.execute-api.us-east-1.amazonaws.com/dev/maincontent";
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var params = event.body;
    var message;
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            // console.log(http.responseText);
            message = JSON.parse(http.responseText).message;
            //console.log(message);



            var config = {invokeUrl:'https://hsrccxadaf.execute-api.us-east-1.amazonaws.com'};
            var apigClient = apigClientFactory.newClient(config);
            var pathTemplate = '/dev/classify';
            var method = 'POST';
            var additionalParams = {};
            var body = {"text":message};
            var params = {};
            apigClient.invokeApi(params, pathTemplate, method, additionalParams, body).then(function(result){
                var ret = result.data;
                callback(null, {"statusCode": 200, "body": ret});
            });





        }
    }
    http.send(params);


};