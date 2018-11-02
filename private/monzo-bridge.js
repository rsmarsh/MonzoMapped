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

    console.log(token);
    // This will find the Unix Timestamp of when this access token expires, whilst being careful of accidental concatenation 
    var tokenExpiryDate = parseInt(new Date().getTime()/1000)+parseInt(token.expires_in);

    // Insert this into the Database so that sessions can be reused without the user having to reauthenticate each time
    let insertStatement = `
        INSERT INTO MonzoLink (user_id, access_token, refresh_token, token_expires, account_id)
        SELECT user_id, `+db.escape(token.access_token)+`, `+db.escape(token.refresh_token)+`, `+db.escape(tokenExpiryDate)+`, `+db.escape(token.user_id)+` FROM Users
        WHERE email=`+db.escape(req.session.email)+`
    `;
    // inserts are access_token, refresh_token  and the current user's email
    // let inserts = [token.access_token, token.refresh_token, req.session.email];
    let inserts = [];
    db.query(insertStatement, inserts, function(err, results){
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                res.send("You have already a Monzo account to this account, only one Monzo account per user is currently supported");
                return;
            }
        }
        console.log("successfully inserted a monzo account for user", req.session.email);
        res.send('successfully created a link to this Monzo account');
    });
    

};



module.exports = {
    connectMonzo: connectMonzo,
    getAccessToken: receiveAuthCode
};