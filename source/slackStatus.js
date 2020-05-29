var request = require('request');
module.exports = function (RED) {
    "use strict";

    function slackStatus(n) {
        RED.nodes.createNode(this, n);
        var node = this;

        var flowObj = n.data || {}
        var methodValue = n.emoji
        var childPathProperty = n.childpath || ""
        var propertyType = n.propertyType || "msg";
        var globalContext = this.context().global;
        var flowContext = this.context().flow;
        var slackCertificate = RED.nodes.getNode(n.slackCertificate);
        var expirationTime = n.expiration;

        node.on("input", function (msg) {
            node.status({});
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
            if (methodValue == "msg.emoji" || methodValue == "") {
                methodValue = msg.emoji
            }
            if (expirationTime == "msg.expiration" || expirationTime == "") {
                expirationTime = msg.expiration
            } else {
                var newExpirationTime = Math.round((new Date()).getTime() / 1000);
                switch (expirationTime) {
                    case "1":
                        // Add 1 hour to expiration date
                        newExpirationTime += 60 * 60;
                        break;
                    case "2":
                        // Add 2 hours to expiration date
                        newExpirationTime += 120 * 60;
                        break;
                    default:
                        // Default is 0, the status can only be change or delete by user manually.
                        newExpirationTime = 0;
                        break;
                }
                expirationTime = newExpirationTime;
            }
            requestData(flowObj, methodValue, slackCertificate, expirationTime, childPath, node, msg)
        })
    }
    function requestData(flowObj, methodValue, slackCertificate, expirationTime, childPath, node, msg, ) {
        var flowObj = {
            "profile": {
                "status_text": childPath,
                "status_emoji": methodValue,
                "status_expiration": expirationTime,
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
            if (error) {
                node.error(error, {});
                node.status({ fill: "red", shape: "ring", text: "failed" });
            } else {
                msg.payload = flowObj;
                node.send(msg);
            }
        });
    }

    RED.nodes.registerType("slackStatus", slackStatus);
};