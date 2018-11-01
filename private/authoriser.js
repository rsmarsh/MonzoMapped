const request = require('request');
const monzoOAuth = require('./credentials/monzo-oauth');
const db = require('./database.js');

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
            console.error('error getting access token: ')
            console.error(accessToken);
            res.send(accessToken.message);
            return;
        }
        receiveAccessToken(req, res, accessToken);
    });

};

// Receive an access token after the user clickes the confirmation link in their email from Monzo
let receiveAccessToken = function (req, res, token) {

    // This will find the Unix Timestamp of when this access token expires
    var tokenExpiryDate = new Date().getTime()+parseInt(token.expires_in);

    // Insert this into the Database so that sessions can be reused without the user having to reauthenticate each time
    let insertStatement = `
        INSERT INTO MonzoLink (user_id, access_token, refresh_token, token_expires)
        SELECT user_id, `+db.escape(token.access_token)+`, `+db.escape(token.refresh_token)+`, `+db.escape(tokenExpiryDate)+` FROM Users
        WHERE email=`+db.escape(req.session.email)+`
    `;
    // inserts are access_token, refresh_token  and the current user's email
    // let inserts = [token.access_token, token.refresh_token, req.session.email];
    let inserts = [];
    db.query(insertStatement, inserts, function(results){
        console.log("successfully created a monzo link for user", req.session.email);
        res.send('auth with monzo created successfully');
    });
    

};



module.exports = {
    connectMonzo: connectMonzo,
    getAccessToken: receiveAuthCode
};