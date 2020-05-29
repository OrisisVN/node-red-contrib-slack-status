var request = require('request');
module.exports = function (RED) {
    "use strict";

    function slackStatus(n) {
        RED.nodes.createNode(this, n);
        var node = this;

        var newObj = n.data || {}
        var request = require('request');

        var methodValue = n.method
        var childPathProperty = n.childpath || ""
        var propertyType = n.propertyType || "msg";
        var globalContext = this.context().global;
        var flowContext = this.context().flow;

        var slackCertificate = RED.nodes.getNode(n.slackCertificate);
        var url_params = "";

        node.on("input", function (msg) {
            node.status({});

            // console.log("methodValue", methodValue);
            // console.log("propertyType", propertyType);
            // console.log("childPathProperty", childPathProperty);

            // select childPath
            var childPath = "";
            switch (propertyType) {
                case "str":
                    childPath = childPathProperty
                    break;
                case "msg":
                    childPath = msg[childPathProperty]
                    break;
                case "flow":
                    childPath = flowContext.get(childPathProperty)
                    break;
                case "global":
                    childPath = globalContext.get(childPathProperty)
                    break;
                default:
                    childPath = childPathProperty
                    break;
            }
            if (methodValue == "setPriority" || methodValue == "setWithPriority") {
                methodValue = "put"
            } else if (methodValue == "msg.method" || methodValue == "") {
                methodValue = msg.method
            };
        })
        // var testObj = {
        //     "profile": {
        //         "status_text": "Traveling",
        //         "status_emoji": ":palm_tree:",
        //         "status_expiration": 0
        //     }
        // };
        // request({
        //     url: "https://slack.com/api/users.profile.set",
        //     method: "POST",
        //     json: true,
        //     headers: {
        //         "Content-type": "application/json; charset=utf-8",
        //         "Authorization": "Bearer " + slackCertificate['accesstoken'],
        //     },
        //     body: testObj
        // }, function (error, response, body) {
        //     console.log(response);
        // });
    }
    function requestData(newObj, methodValue, url_params, url_params_childpath, node, msg) {
        //     var opts = {
        //         method: 'POST',
        //         url: 'https://slack.com/api/users.profile.set',
        //         body: JSON.stringify(newObj)
        //     }
        console.log(slackCertificate['accesstoken'])
    }

    RED.nodes.registerType("slackStatus", slackStatus);
};