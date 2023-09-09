const { FLIPPED_ALIAS_KEYS } = require('@babel/types');
const { error, table } = require('console');
const { configDotenv } = require('dotenv');
const express = require('express');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.resolve(__dirname, 'secrets.env') });
const bcrypt = require('bcryptjs');
const { rawListeners } = require('process');
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');
const cookieParser = require('cookie-parser');


const app = express();
const port = 3000;

const database_user_password = process.env.database_user_password;
const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'blog',
    password: database_user_password,
    port: 5432, // Default PostgreSQL port
});

app.use(cookieParser());
const jwt_password = process.env.jwt_password;
const authMiddleware = expressJwt({
    secret: jwt_password,
    algorithms: ['HS256'],
    getToken: function (req) {
        const token = req.cookies && req.cookies.jwt_access_cookie;
        return token || null;
    }
});

function getMilliseconds(hours) { // returns the milliseconds that there are in certain amount of hours
    return 1000 * 60 * 60 * hours;
}

function addZero(value) { // adds zero to the start of values if possible (eg. input: 7 output: 07)
    return value.toString().padStart(2, '0');
}

function consoleInfo(message) {
    var timeInMilliseconds = getMilliseconds(2);

    var currentDate = new Date();
    var currentPolishTime = new Date(currentDate.getTime() + timeInMilliseconds);

    var localYear = currentPolishTime.getFullYear();
    var localMonth = addZero(currentPolishTime.getMonth() + 1); // months start from the index 0, so we are adding 1
    var localDay = addZero(currentPolishTime.getDate());
    var localHours = addZero(currentPolishTime.getHours());
    var localMinutes = addZero(currentPolishTime.getMinutes());
    var localSeconds = addZero(currentPolishTime.getSeconds());

    console.log(`${localDay}/${localMonth}/${localYear.toString().slice(-2)} - ${localHours}:${localMinutes}:${localSeconds} > ${message}`)
}

function checkIfStringContainsIllegalChar(string, legalChars) {
    for (let i = 0; i < string.length; i++) {
        if (legalChars.indexOf(string[i]) === -1) {
            return true; // Found an illegal character
        }
    }
    return false; // All characters are legal
}

function checkIfEmailCorrect(email) {
    const some_regex_that_i_wrote_while_being_drunk = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return some_regex_that_i_wrote_while_being_drunk.test(email)
}

async function checkIfUsernameTaken(username) {
    const query = `SELECT id FROM "user" WHERE username = \$1;`
    var result = await pool.query(query, [username]);

    if (result.rowCount > 0) {
        return true
    }

    return false
}

async function hash(some_string, saltRounds) {
    // more salt rounds = more secure, but takes longer to hash (12 = 2/3 hashes per second)
    return bcrypt.hash(some_string, saltRounds)
}

async function register_account(username, email, password) {
    try {
        const command = `INSERT INTO "user" (username, email, password) VALUES (\$1, \$2, \$3);`
        const values = [username, email, await hash(password, 12)];
        await pool.query(command, values);
    } catch (error) {
        consoleInfo(`Something went wrong while writing the user's info to the database, here is the error: ${error}.`)
    }
}

async function checkIfPasswordsMatch(password, password_hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, password_hash).then(res => {
            if (res) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).catch(error => {
            console.error(`Something went wrong while checking if user's password matches, here is the error: ${error}`);
            reject(error);
        });
    });
}

async function checkHowMuchEmailIsInTheDatabase(email) {
    try {
        const query = `SELECT username FROM "user" WHERE email = \$1;`
        var result = await pool.query(query, [email]);

        return result.rowCount;
    } catch (error) {
        consoleInfo(`Something went wrong while checking how much users use a email, here is the error: ${error}.`)
    }
}

async function getHashedPassword(username) {
    try {
        const query = `SELECT password FROM "user" WHERE username = \$1;`
        var result = await pool.query(query, [username]);

        if (result.rows.length > 0) {
            const hashedPassword = result.rows[0].password;

            return hashedPassword;
        } else {
            consoleInfo(`${req.ClientIP} tried to log on a account that doesn't exist (usename: ${username}).`)
            return null;
        }
    } catch (error) {
        consoleInfo(`Something went wrong while checking how much users use a email, here is the error: ${error}.`)
    }
}


app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));
app.use('/icons', express.static(path.join(__dirname, 'icons')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/videos', express.static(path.join(__dirname, 'videos')));
app.use('/robots.txt', express.static(path.join(__dirname, 'robots.txt')));

app.set('trust proxy', true);

app.use(function (req, res, next) {
    ClientIP = req.headers['x-forwarded-for']
    if (ClientIP) {
        req.ClientIP = ClientIP;
    } else {
        req.ClientIP = "<empty_string>"
    }

    next();
});

app.use(express.json());


// '/' route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
    consoleInfo(`${req.ClientIP} requested the '/' route`)
});

// '/temp' route
app.get('/temp', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'temp_mobile_index.html'));
    consoleInfo(`${req.ClientIP} requested the '/temp' route`)
});

// '/mobileinfo' route
app.get('/mobileinfo', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'errors', 'page_not_mobile.html'));
    consoleInfo(`${req.ClientIP} requested the '/mobileinfo' route`)
});

// '/blog' route
app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'pages', 'blog', 'blog.html'));
    consoleInfo(`${req.ClientIP} requested the '/blog' route`)
});

// '/blog/settings'
app.get('/blog/settings', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'pages', 'blog', 'settings.html'));
    consoleInfo(`${req.ClientIP} requested the '/blog/settings' route, username "${req.auth.username}".`)
});

// '/blog/login' route
app.get('/blog/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'pages', 'blog', 'login.html'));
    consoleInfo(`${req.ClientIP} requested the '/blog/login' route`)
});

// login end-point
app.post('/blog/login/post', async (req, res) => {
    const { username, password } = req.body;

    var password_hash = await getHashedPassword(username)

    if (password_hash == null) {
        res.status(200).send(`This username doesn't exist yet! You can register it <a href="/blog/register/">here</a> :)`)
        return
    }

    var authenticated = await checkIfPasswordsMatch(password, password_hash)
    if (authenticated == true) {
        consoleInfo(`${req.ClientIP} has successfully logged in! (as "${username}").`)

        // Generate a JWT token
        const token = jwt.sign({username}, jwt_password, { expiresIn: '7d' });

        // Send the token back to the client
        res.cookie('jwt_access_cookie', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, secure: true, sameSite: "strict"}); // 7 days expiration
        res.status(200).send(`Successfully logged in! Checkout your page <a href="/blog/user/${username}">here</a> :D`);
    } else {
        consoleInfo(`${req.ClientIP} has failed to authenticate (tried to as "${username}").`)
        res.status(200).send(`Wrong password! :/`)
    }
});

// '/blog/register' route
app.get('/blog/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'pages', 'blog', 'register.html'));
    consoleInfo(`${req.ClientIP} requested the '/blog/register' route`)
});

// registeration thing
app.post('/blog/register/post', async (req, res) => {
    // Retrieve data from the request body
    const { username, email, password } = req.body;

    const legal_chars = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm',
        'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M',
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '@', '.', '-', '_']

    const containsIllegalUsername = checkIfStringContainsIllegalChar(username, legal_chars);
    const containsIllegalEmail = checkIfStringContainsIllegalChar(email, legal_chars);
    const EmailSyntaxCorrect = checkIfEmailCorrect(email)
    const usernameAlreadyRegistered = await checkIfUsernameTaken(username)

    var EmailHasTooMuchAccounts = false
    const EmailsAssociatedWithEmail = await checkHowMuchEmailIsInTheDatabase(email)
    if (EmailsAssociatedWithEmail > 2) {
        var EmailHasTooMuchAccounts = true
    }


    var valid = true
    var reason = ""

    if (username.length > 20) {
        var valid = false
        var reason = "the username can't be longer than 20 chars :/"
        consoleInfo(`${req.ClientIP} tried to register a account that had a username longer than 255 chars`)
    } else if (username.length < 4) {
        var valid = false
        var reason = "the username can't be shorter than 4 chars :P"
        consoleInfo(`${req.ClientIP} tried to register a account that had a username shorter than 4 chars`)
    } else if (containsIllegalUsername == true) {
        var valid = false
        var reason = 'the username contains some banned char/s (if you want me to add char/s, <a href="/">contact me</a>)'
        consoleInfo(`${req.ClientIP} tried to register a account that username's contained a char/chars not in legal_chars`)
    } else if (usernameAlreadyRegistered == true) {
        var valid = false
        var reason = 'the username is already taken ;/'
        consoleInfo(`${req.ClientIP} tried to register a account that username's was already taken`)
    }

    else if (password.length < 5) {
        var valid = false
        var reason = "the password can't be shorter than 5 chars :/"
        consoleInfo(`${req.ClientIP} tried to register a account that had a password shorter than 5 chars`)
    }

    else if (email.length < 5) {
        var valid = false
        var reason = "lmao, nice email, buddy."
        consoleInfo(`${req.ClientIP} tried to register a account that had a email shorter than 5 chars`)
    } else if (containsIllegalEmail == true) {
        var valid = false
        var reason = 'the email contains some banned char/s (if you want me to add char/s, <a href="https://khenzii.dev/">contact me</a>)'
        consoleInfo(`${req.ClientIP} tried to register a account that email's contained a char/chars not in legal_chars`)
    } else if (EmailSyntaxCorrect == false) {
        var valid = false
        var reason = "make sure to enter the correct email :)"
        consoleInfo(`${req.ClientIP} tried to register a account with an incorrect email`)
    } else if (EmailHasTooMuchAccounts == true) {
        var valid = false
        var reason = "Too many accounts (3) use this email. Sorry!"
        consoleInfo(`${req.ClientIP} tried to register a account with an over-used email`)
    }


    if (valid == false) {
        res.status(200).send(reason)
        return
    }


    consoleInfo(`${req.ClientIP} entered valid info while registering`)

    try {
        await register_account(username, email, password)

        // Generate a JWT token
        const token = jwt.sign({username}, jwt_password, { expiresIn: '7d' });
        // Send the token back to the client
        res.cookie('jwt_access_cookie', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, secure: true, sameSite: "strict"}); // 7 days expiration
        
        res.status(200).send(`your account should be ready <a href="/blog/user/${username}">here</a> (in a moment :>)`)
    } catch (error) {
        consoleInfo(`something went wrong while registering the account. Here is the error: ${error}.`)
        res.status(500)
    }
});

// retrieve stuff in the database that is connected to a column and table (for example: if you pass the <username>, <table> here, you will get back every result that matches the query)
app.post('/blog/get_info', async (req, res) => {
    try {
        // Retrieve data from the request body
        const table = req.body[0];
        const column = req.body[1];
        const what = req.body[2];
        const something = req.body[3];

        const NotValidTables = []; // Add tables that you don't want the client to get here later
        const NotValidColumns = ['*', 'password', 'email']; // Add columns that you don't want the client to get here
        const NotValidWords = ['DROP']

        blacklisted_words = NotValidWords.includes(table.toUpperCase()) && NotValidWords.includes(column.toUpperCase()) && NotValidWords.includes(what.toUpperCase()) && NotValidWords.includes(something.toUpperCase())
        // just to make sure..

        if (!NotValidTables.includes(table) && !NotValidColumns.includes(column) && !blacklisted_words) {
            const query = `SELECT ${column} FROM ${table} WHERE ${what} = \$1;`
            var result = await pool.query(query, [something]);
        } else {
            consoleInfo(`${req.ClientIP} requested a table / column that is on the black-list, or has modified the deafult client's side javascript to make it contain the 'DROP' command. you might want to look into that.`)
            res.status(400).send('IPs noted, Hitman: sent. Please stop playing around with the site <3');
            return
        }

        if (result.rows.length === 0) {
            consoleInfo("the requested thing was empty :/")
            res.status(404).send("empty :(")
            return
        }

        res.status(200).send(result.rows)
    } catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Check console for more Details. Sorry.');
        consoleInfo(`${req.ClientIP} got a 500 error (while communicating with the back-end). Error: ${error}.`)
    }
});

// user profiles in /blog/user (/blog/user/<username>)
app.get('/blog/user/:username', async (req, res) => {
    const { username } = req.params;

    consoleInfo(`${req.ClientIP} requested '/blog/user/${username}'.`)

    try {
        const query = `SELECT * FROM "user" WHERE username = \$1;`
        const result = await pool.query(query, [username]);

        if (result.rows.length === 0) {
            res.status(404).sendFile(path.join(__dirname, 'html', 'errors', 'error_404.html'));
            consoleInfo(`${req.ClientIP} got the 404 error. Route: '/blog/user/${username}'`)
            return
        }

        const user = result.rows[0];
        res.sendFile(path.join(__dirname, 'html', 'pages', 'blog', 'profile.html'));
    }

    catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Check console for more Details. Sorry.');
        consoleInfo(`${req.ClientIP} got a 500 error. Route: '/blog/user/${username}'. Error: ${error}`)
    }
});

// redirect from /blog/user
app.get('/blog/user', async (req, res) => {
    consoleInfo(`${req.ClientIP} tried to get the '/blog/user' route, sending him to '/blog'`)
    res.redirect('/blog');
});

// '/projects' route
app.get('/projects', (req, res) => {
    // res.sendFile(path.join(__dirname, 'html', 'pages', 'projects', 'projects.html'));
    // uncomment the above line later, right now the /projects page 
    // is still being build so the route shows the `this page is
    // still being build` html
    res.sendFile(path.join(__dirname, 'html', 'errors', 'page_being_build.html'));
    consoleInfo(`${req.ClientIP} requested the '/projects' route`)
});

// '/freebobux' route
app.get('/freebobux', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'pages', 'freebobux', 'freebobux.html'));
    consoleInfo(`${req.ClientIP} requested the '/freebobux' route :D`)
});

// '/snake' route
app.get('/snake', (req, res) => {
    // res.sendFile(path.join(__dirname, 'html', 'pages', 'snake', 'snake.html'));
    // uncomment the above line later, right now the /snake page
    // is still being build so the route shows the `this page is
    // still being build` html
    res.sendFile(path.join(__dirname, 'html', 'errors', 'page_being_build.html'));
    consoleInfo(`${req.ClientIP} requested the '/snake' route`)
});

// '/page_being_build' route
app.get('/page_being_build', (req, res) => {
    // if you are lazy, instead of showing the user the html file
    // using this line of code:
    // res.sendFile(path.join(__dirname, 'html', 'errors', 'page_being_build.html'));
    // you can just redirect to this route :)
    // (however ima still show the html file on other routes when
    // they are being worked on because it gives the user more info
    // redirecting can be confusing)
    res.sendFile(path.join(__dirname, 'html', 'errors', 'page_being_build.html'));
    consoleInfo(`${req.ClientIP} requested the '/page_being_build' route`)
});

// Place routes above this comment!!!

// 404 error
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'html', 'errors', 'error_404.html'));
    consoleInfo(`${req.ClientIP} got the 404 error`)
});

// Default error handler
app.use(function (error, req, res, next) {
    if(error.name === "UnauthorizedError") {
        res.redirect("/blog/login");
        consoleInfo(`${req.ClientIP} tried to access confidential stuff, such as '/blog/settings', without the correct authentication :/`)
    } else {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Check console for more Details. Sorry.');
        consoleInfo(`${req.ClientIP} some internal server error ocurred :/. Here is the error: ${error.stack}`)
    }
});

// Place errors above this comment!


// DONT PUT ROUTES HERE!!!
// if you will put a ordinary route here or some other stuff then
// the error pages would stop working and everything would frick up


app.listen(port, () => {
    console.log(`server waiting for nginx redirects here: http://localhost:${port} 🫡`);
});