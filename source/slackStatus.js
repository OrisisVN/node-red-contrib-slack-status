var request = require('request');
module.exports = function (RED) {
    "use strict";

    function slackStatus(n) {
        RED.nodes.createNode(this, n);
        var node = this;

        var flowObj = n.data || {}
        var request = require('request');
        var methodValue = n.emoji
        var childPathProperty = n.childpath || ""
        var propertyType = n.propertyType || "msg";
        var globalContext = this.context().global;
        var flowContext = this.context().flow;

        var slackCertificate = RED.nodes.getNode(n.slackCertificate);

        node.on("input", function (msg) {
            node.status({});

            // console.log("methodValue", methodValue);
            // console.log("childPathProperty ", childPathProperty)
            // console.log("propertyType", propertyType);

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
            } else if (methodValue == "msg.emoj" || methodValue == "") {
                methodValue = msg.emoji
            };
            requestData(flowObj, methodValue, node, msg, slackCertificate, childPathProperty)
        })

    }
    function requestData(flowObj, methodValue, node, msg, slackCertificate, childPathProperty) {
        var flowObj = {
            "profile": {
                "status_text": childPathProperty,
                "status_emoji": methodValue,
                "status_expiration": 0
            }
        };
        request({
            url: "https://slack.com/api/users.profile.set",
            method: "POST",
            json: true,
            headers: {
                "Content-type": "application/json; charset=utf-8",
                "Authorization": "Bearer " + slackCertificate['accesstoken'],
            },
            body: flowObj
        }, function (error, response, body) {
            console.log(response);
        });
    }

    RED.nodes.registerType("slackStatus", slackStatus);
};