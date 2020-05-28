module.exports = function (RED) {
  "use strict";
  function slackCertificate(n) {
    RED.nodes.createNode(this, n);
    var node = this;

    this.accesstoken = this.credentials.accesstoken;
  }
  RED.nodes.registerType("slackCertificate", slackCertificate, {
    credentials: {
      accesstoken: { type: 'password' }
    }
  });
};