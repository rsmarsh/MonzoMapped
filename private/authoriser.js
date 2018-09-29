const http = require('http');
const monzoOAuth = require('./credentials/monzo-oauth');

let accessToken;

let connectMonzo = function (req, res) {
    console.log("connect monzo function ran");
    res.type('html');
    res.send(`
        <h1>Hello</h1>
        <form action="${monzoOAuth.authURL}">
            <input type="hidden" name="client_id" value="${monzoOAuth.clientID}" />
            <input type="hidden" name="redirect_uri" value="${monzoOAuth.redirectURI}" />
            <input type="hidden" name="response_type" value="code" />
            <button>Sign in</button>
        </form>
    `);
};

module.exports = {
    connectMonzo: connectMonzo
};