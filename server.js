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
const fs = require('fs');


const app = express();
const port = 3000;

const trusted_usernames = ["Khenzii"]

const hours_off = 2

function addZero(value) { // adds zero to the start of values if possible (eg. input: 7 output: 07)
    return value.toString().padStart(2, '0');
}

function getDate(hours_off) {
    var currentTime = new Date();

    var localYear = addZero(currentTime.getUTCFullYear());
    var localMonth = addZero(currentTime.getUTCMonth() + 1); // months start from the index 0, so we are adding 1
    var localDay = addZero(currentTime.getUTCDate());
    var localHours = addZero(currentTime.getUTCHours() + hours_off);
    var localMinutes = addZero(currentTime.getUTCMinutes());
    var localSeconds = addZero(currentTime.getUTCSeconds());

    return {
        localYear: localYear,
        localMonth: localMonth,
        localDay: localDay,
        localHours: localHours,
        localMinutes: localMinutes,
        localSeconds: localSeconds
    };
}

function consoleInfo(message) {
    var localDate = getDate(hours_off)

    console.log(`${localDate.localDay}/${localDate.localMonth}/${localDate.localYear} - ${localDate.localHours}:${localDate.localMinutes}:${localDate.localSeconds} > ${message}`)
}

function daysSince(getDateFunction, then_string) {
    // the past date will always be in this format: <days>/<months>/<year> - <hours>:<minutes>:<seconds>
    const dateComponents = then_string.split(' - ')[0].split('/');
    const timeComponents = then_string.split(' - ')[1].split(':');

    const thenDate = new Date(
        parseInt(dateComponents[2]), // year
        parseInt(dateComponents[1]), // month
        parseInt(dateComponents[0]), // day
        parseInt(timeComponents[0]), // hours
        parseInt(timeComponents[1]), // minutes
        parseInt(timeComponents[2])  // seconds
    );

    currentDate = new Date(
        getDateFunction.localYear,   // year
        getDateFunction.localMonth,  // month
        getDateFunction.localDay,    // day
        getDateFunction.localHours,  // hours
        getDateFunction.localMinutes,// minutes
        getDateFunction.localSeconds // seconds
    )

    var millisecondsSince = currentDate - thenDate;
    var daysSince = Math.floor(millisecondsSince / (1000 * 60 * 60 * 24));

    return daysSince;
}


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
// use this middleware for routes that REQUIRE verifictation
const authMiddleware = expressJwt({
    secret: jwt_password,
    algorithms: ['HS256'],
    getToken: function (req) {
        const token = req.cookies && req.cookies.jwt_access_cookie;
        return token || null;
    }
});

// use this middleware for routes that check if user is verified
const checkAuthMiddleware = (req, res, next) => {
    try {
        const token = req.cookies && req.cookies.jwt_access_cookie;
        if (!token) {
            req.isAuthenticated = false;
            next();
            return;
        }

        jwt.verify(token, jwt_password, { algorithms: ['HS256'] }, (err, decoded) => {
            if (err) {
                req.isAuthenticated = false;
            } else {
                req.isAuthenticated = true;
                req.auth = decoded;
            }
            next();
        });
    } catch (err) {
        req.isAuthenticated = false;
        next();
    }
};


// blog stuff here (some functions)
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

async function hash(some_string, saltRounds) {
    // more salt rounds = more secure, but takes longer to hash (12 = 2/3 hashes per second)
    return bcrypt.hash(some_string, saltRounds)
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

// DATABASE STUFF BELOW!
// functions that access database should be placed below
// other than them, a couple of API endpoints also run SQL queries
// have an eye on these things.
async function checkIfUsernameTaken(username) {
    const query = `SELECT id FROM "user" WHERE username = \$1;`
    var result = await pool.query(query, [username]);

    if (result.rowCount > 0) {
        return true
    }

    return false
}

async function register_account(username, email, password) {
    try {
        // get the current date
        var localDate = getDate(hours_off)
        var joined_at = `${localDate.localDay}/${localDate.localMonth}/${localDate.localYear} - ${localDate.localHours}:${localDate.localMinutes}:${localDate.localSeconds}`

        // input all of the needed stuff into the user table
        var command = `INSERT INTO "user" (username, email, password, joined_at) VALUES (\$1, \$2, \$3, \$4);`
        var values = [username, email, await hash(password, 12), joined_at];
        await pool.query(command, values);

        // then lets create some place holders
        // firstly lets get the new user's id
        var command = `SELECT id FROM "user" WHERE username = \$1`
        var values = await pool.query(command, [username])

        const user_id = values.rows[0].id

        // now that we have the user's id, lets write the placeholders
        // firstly lets create the user's bio
        var command = `INSERT INTO "bio" (user_id, text_value, links) VALUES (\$1, \$2, \$3);`
        await pool.query(command, [user_id, "No bio yet :)", "No links yet :)"])

        // now lets write the profile picture
        var command = `INSERT INTO "profile_picture" (user_id, "default") VALUES (\$1, \$2);`
        await pool.query(command, [user_id, "true"])
    } catch (error) {
        consoleInfo(`Something went wrong while writing the user's info to the database, here is the error: ${error}. Username: ${username}.`)
    }
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


// blog stuff below

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
app.get('/blog/login', checkAuthMiddleware, (req, res) => {
    if(req.isAuthenticated) {
        res.redirect(`/blog/user/${req.auth.username}`)
        consoleInfo(`${req.ClientIP} tried to access the login page while being logged in, username: ${req.auth.username}`)
        return
    }

    res.sendFile(path.join(__dirname, 'html', 'pages', 'blog', 'login.html'));
    consoleInfo(`${req.ClientIP} requested the '/blog/login' route`)
});

// '/blog/register' route
app.get('/blog/register', checkAuthMiddleware, (req, res) => {
    if(req.isAuthenticated) {
        res.redirect(`/blog/user/${req.auth.username}`)
        consoleInfo(`${req.ClientIP} tried to access the register page while being logged in, username: ${req.auth.username}`)
        return
    }

    res.sendFile(path.join(__dirname, 'html', 'pages', 'blog', 'register.html'));
    consoleInfo(`${req.ClientIP} requested the '/blog/register' route`)
});

// redirect from /blog/user
app.get('/blog/user', async (req, res) => {
    consoleInfo(`${req.ClientIP} tried to get the '/blog/user' route, sending him to '/blog'`)
    res.redirect('/blog');
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


// Place routes above this comment!!!
// API endpoints below!! :)

// login end-point
app.post('/blog/api/login', async (req, res) => {
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
        const token = jwt.sign({ username }, jwt_password, { expiresIn: '7d' });

        // Send the token back to the client
        res.cookie('jwt_access_cookie', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, secure: true, sameSite: "strict" }); // 7 days expiration
        res.status(200).send(`Successfully logged in! Checkout your page <a href="/blog/user/${username}">here</a> :D`);
    } else {
        consoleInfo(`${req.ClientIP} has failed to authenticate (tried to as "${username}").`)
        res.status(200).send(`Wrong password! :/`)
    }
});

// registeration end-point
app.post('/blog/api/register', async (req, res) => {
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
        consoleInfo(`${req.ClientIP} tried to register a account that had a username longer than 20 chars`)
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
        const token = jwt.sign({ username }, jwt_password, { expiresIn: '7d' });
        // Send the token back to the client
        res.cookie('jwt_access_cookie', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, secure: true, sameSite: "strict" }); // 7 days expiration

        consoleInfo(`registered a new account with username: ${username}`)
        res.status(200).send(`your account should be ready <a href="/blog/user/${username}">here</a> (in a moment :>)`)
    } catch (error) {
        consoleInfo(`something went wrong while registering the account. Here is the error: ${error}.`)
        res.status(500)
    }
});

// retrieve stuff about user
app.post('/blog/api/get_user', checkAuthMiddleware, async (req, res) => {
    try {
        // Retrieve data from the request body
        const username = req.body[0];

        // initialize the object that we will later return (it will contain all of the data)
        var data = {}

        // run the SQL queries
        // first one is for user_id
        var query = `SELECT id, joined_at FROM "user" WHERE username = \$1;`
        var result = await pool.query(query, [username]);

        const user_id = result.rows[0].id
        data.user_id = user_id;
        const joined_at = result.rows[0].joined_at

        var daysPassed = daysSince(getDate(2), joined_at)
        var joined_at_with_days = `${joined_at}; ${daysPassed} day/s ago`

        data.joined_at = joined_at_with_days;

        // the second one for user's profile picture
        var query = `SELECT "default" FROM "profile_picture" WHERE user_id = \$1;`
        var result = await pool.query(query, [user_id]);

        const default_setting = result.rows[0].default

        var image = ""

        if(default_setting == "true") {
            var image = "/icons/pages/blog/pfp_placeholder.png"
        } else {
            // if user has a custom profile picture, get it's name
            var query = `SELECT id FROM "profile_picture" WHERE user_id = \$1;`
            var result = await pool.query(query, [user_id]);

            var name =  result.rows[0].id

            var image = `/images/blog/${name}.png`
        }

        data.image = image

        // the third one for user's bio
        var query = `SELECT text_value, links FROM "bio" WHERE user_id = \$1;`
        var result = await pool.query(query, [user_id]);

        const bio_and_links = result.rows[0]
        data.bio_and_links = bio_and_links;

        // the forth one for user's categories
        var query = `SELECT title, description, id FROM "category" WHERE user_id = \$1;`
        var result = await pool.query(query, [user_id]);

        var categories = ""

        if (result.rowCount > 0) {
            categories = result.rows
        } else {
            categories = "404"
        }
        data.categories = categories;

        if (req.isAuthenticated) {
            if (req.auth.username == username) {
                data.logged_in = true
            } else {
                data.logged_in = false
            }
        } else {
            data.logged_in = false
        }

        res.status(200).send(data)
    } catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Check console for more Details. Sorry.');
        consoleInfo(`${req.ClientIP} got a 500 error (while communicating with the back-end). Error: ${error}.`)
    }
});

// retrieve stuff about user (this endpoint is being used by settings (it's not requesting useless stuff such as categories like get_user endpoint))
app.post('/blog/api/get_user_settings', async (req, res) => {
    try {
        // Retrieve data from the request body
        const username = req.body[0];

        res.status(200).send(data)
    } catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Check console for more Details. Sorry.');
        consoleInfo(`${req.ClientIP} got a 500 error (while communicating with the back-end). Error: ${error}.`)
    }
});

// retrieve user's posts
app.post('/blog/api/get_posts', async (req, res) => {
    try {
        // Retrieve data from the request body
        const category_id = req.body[0];

        res.status(200).send(result.rows)
    } catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Check console for more Details. Sorry.');
        consoleInfo(`${req.ClientIP} got a 500 error (while communicating with the back-end). Error: ${error}.`)
    }
});

// create category
app.post('/blog/api/create_category', authMiddleware, async (req, res) => {
    try {
        // Retrieve data from the request body
        const { user_id, categoryTitle, categoryDescription } = req.body;

        // 1. check if req.auth.username = user_id's username (we don't want people to create categories on others accounts ;D)
        var query = `SELECT username FROM "user" WHERE id = \$1;`
        var result = await pool.query(query, [user_id]);

        if(req.auth.username == result.rows[0].username) {
            // 2. check if over character limit
            if(categoryTitle.length > 30 && !trusted_usernames.includes(req.auth.username)) {
                res.status(400).send(`The category title can't be longer than 30 characters. Sorry.`);
                consoleInfo(`${req.ClientIP} aka ${req.auth.username} tried to create a category that had a title longer than 30 characters.`)
                return
            } 
            
            if (categoryDescription.length > 200 && !trusted_usernames.includes(req.auth.username)) {
                res.status(400).send(`The category description can't be longer than 200 characters. Sorry.`);
                consoleInfo(`${req.ClientIP} aka ${req.auth.username} tried to create a category that had a description longer than 200 characters.`)
                return
            }

            // 3. write to the db
            var command = `INSERT INTO "category" (user_id, title, description) VALUES (\$1, \$2, \$3);`
            await pool.query(command, [user_id, categoryTitle, categoryDescription])

            res.status(200).send("Success!")
        }
    } catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Check console for more Details. Sorry.');
        consoleInfo(`${req.ClientIP} got a 500 error (while communicating with the back-end). Error: ${error}.`)
    }
});

// create post
app.post('/blog/api/create_post', authMiddleware, async (req, res) => {
    try {
        // Retrieve data from the request body
        const { category_id, text_value } = req.body;

        // 1. check if authMiddleware.username = user_id's username (we don't want people to create posts on others accounts ;D)
        // get the user_id using category_id
        var query = `SELECT user_id FROM "category" WHERE id = \$1;`
        var result = await pool.query(query, [category_id]);

        var query = `SELECT username FROM "user" WHERE id = \$1;`
        var result = await pool.query(query, [result.rows[0].user_id]);

        console.log("delete us later!")
        console.log(result.rows[0].username)

        if(req.auth.username == result.rows[0].username) {
            // 2. check if over character limit
            if(text_value.length > 1000 && !trusted_usernames.includes(req.auth.username)) {
                res.status(400).send(`The post content can't be longer than 1000 characters. Sorry.`);
                consoleInfo(`${req.ClientIP} aka ${req.auth.username} tried to create a post that was longer than 1000 chars.`)
                return
            } 

            // 4. get the current date and create created_at using it
            var localDate = getDate(hours_off)
            var created_at = `${localDate.localDay}/${localDate.localMonth}/${localDate.localYear} - ${localDate.localHours}:${localDate.localMinutes}:${localDate.localSeconds}`

            // 5. write to the db
            var command = `INSERT INTO "post" (category_id, text_value, created_at) VALUES (\$1, \$2, \$3);`
            await pool.query(command, [category_id, text_value, created_at])

            res.status(200).send("Success!")
        }
    } catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Sorry.');
        consoleInfo(`${req.ClientIP} got a 500 error (while communicating with the back-end). Error: ${error}.`)
    }
});


// 404 error
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'html', 'errors', 'error_404.html'));
    consoleInfo(`${req.ClientIP} got the 404 error`)
});

// Default error handler
app.use(function (error, req, res, next) {
    if (error.name === "UnauthorizedError") {
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
// the error pages would stop working


app.listen(port, () => {
    console.log(`[i] logs are using the UTC+${hours_off} timezone, you can change this setting by modifying the hours_off variable inside of server.js.`)
    console.log(`[i] server waiting for nginx redirects here: http://localhost:${port} 🫡`);
});