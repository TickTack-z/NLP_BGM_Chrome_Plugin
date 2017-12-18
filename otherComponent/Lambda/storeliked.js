var AWS = require('aws-sdk');
AWS.config.update({ accessKeyId: 'AKIAJFP77Z7YWV6LISMQ', secretAccessKey: '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'});
var doc = require('dynamodb-doc');
var dynamodb = new doc.DynamoDB();

exports.handler = (event, context, callback) => {
    console.log(event);
    var dic = JSON.parse(event.body);
    var new_dic={};

    var dbparams = {};
    dbparams.TableName = "UserPic";

    for (var i in dic){
        dbparams.Key = {"UserID": i};
        new_dic["UserID"] = i;
        for (var j in dic[i]){
            new_dic[j] = JSON.stringify(dic[i][j]);
        }
    }
    console.log(JSON.stringify(new_dic));

    dynamodb.getItem(dbparams, function(err, data) {
        console.log("phase2");
        if (err) {
            console.log("phase3");
            console.log(JSON.stringify(new_dic));

            dynamodb.putItem({"TableName":"UserPic","Item":new_dic}, function(err, data) {
                if (err) {
                    console.log(err);
                    callback(null, {
                        statusCode: 500,
                        body: JSON.stringify(
                            {
                                "code": 0,
                                "message": "string",
                                "fields": "string"
                            }
                        )
                    });
                }
            });

        }//end err
        console.log(data);
        if (data == null || data == {} || Object.keys(data).length == 0){
            console.log("phase5");
            //putitem
            dynamodb.putItem({"TableName":"UserPic","Item":new_dic}, function(err, data) {
                if (err) {
                    console.log(err);
                    callback(null, {
                        statusCode: 500,
                        body: JSON.stringify(
                            {
                                "code": 0,
                                "message": "string",
                                "fields": "string"
                            }
                        )
                    });
                }
            });//end of puitem
        }


        var old_data=data.Item;
        for (var ele in new_dic){
            console.log(new_dic[ele]);
            if (ele == "UserID"){
                continue;
            }
            var new_unit = JSON.parse(new_dic[ele]);

            var old_unit
            if (ele in old_data){
                old_unit = JSON.parse(old_data[ele]);
            } else {
                old_unit = {"count": 0, "like": 0, "next":0};
            }
            old_unit.count+=new_unit.count;
            old_unit.like = new_unit.like;
            old_unit["next"]+=new_unit["next"];
            old_data[ele]=JSON.stringify(old_unit);
        }

        dynamodb.putItem({"TableName":"UserPic","Item":old_data}, function(err, data) {
            console.log("phase7");
            if (err) {
                console.log(err);
                callback(null, {
                    statusCode: 500,
                    body: JSON.stringify(
                        {
                            "code": 0,
                            "message": "string",
                            "fields": "string"
                        }
                    )
                });
            }
        });






        callback(null, {
            statusCode: 200,
            body: JSON.stringify(
                {
                    "status": "success",
                    "message": "string"
                })});



    })


    /*
        var logdata=event.requestContext.;
         if (data){
             console.log(data);
             var item={"UserID": userName,"URL":data.Location,"Bucket":"abcdefag"};
     dynamodb.putItem({"TableName":"UserPic","Item":item}, function(err, data) {
            if (err) {
                console.log(err);
                callback(null, {
                statusCode: 500,
                body: JSON.stringify(
                {
              "code": 0,
              "message": "string",
              "fields": "string"
            }
                )
            });
            }
        });
             callback(null, {
                statusCode: 200,
                body: JSON.stringify(
                            {
              "status": "success",
              "message": "string"
            }
                )


       dynamodb.getItem(dbparams, function(err, data) {
            console.log("phase2");
            if (err) {
                console.log("error1");
                console.log(err);
                callback(null, {
                statusCode: 500,
                body: JSON.stringify(
                {
              "code": 0,
              "message": "string",
              "fields": "string"
            }
                )
            });
            }
            console.log(data);

   */
};