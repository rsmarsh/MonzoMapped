const request = require('request');
const monzoOAuth = require('./credentials/monzo-oauth');

let accessToken;

let connectMonzo = function (req, res) {
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

let receiveAuthCode = function (req, res) {
    console.log("received auth code, attempting to get access token...");
    let authCode = req.query.code;
    

    request.post({
        url: monzoOAuth.tokenURL,
        form: {
            grant_type: 'authorization_code',
            client_id: monzoOAuth.clientID,
            client_secret: monzoOAuth.clientSecret,
            redirect_uri: monzoOAuth.redirectURI,
            code: authCode
        }
    }, function(err, response, body){
        // Get access token from the POST response body
        let accessToken = JSON.parse(body);

        if (accessToken.error) {
            console.error('error getting access token: '+accessToken.error);
            return;
        }
        receiveAccessToken(res, accessToken);
    });

};

let receiveAccessToken = function (res, token) {
    console.log("received access token");

    console.log(token);
    res.redirect('/monzo/account');
};



module.exports = {
    connectMonzo: connectMonzo,
    getAccessToken: receiveAuthCode
};