const express = require('express');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.resolve(__dirname, 'secrets.env') });

const app = express();
const port = 3000;

const database_user_password = process.env.database_user_password;
const pool = new Pool({
    user: 'khenzii',
    host: 'localhost',
    database: 'blog_production',
    password: database_user_password,
    port: 5432, // Default PostgreSQL port
});

function getMilliseconds(hours) { // returns the milliseconds that there are in certain amount of hours
    return 1000 * 60 * 60 * hours;
}

function addZero(value) { // adds zero's to the start of values if possible (eg. input: 7 output: 07)
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

// '/blog/login' route
app.get('/blog/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'pages', 'blog', 'login.html'));
    consoleInfo(`${req.ClientIP} requested the '/blog/login' route`)
});

// '/blog/register' route
app.get('/blog/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'pages', 'blog', 'register.html'));
    consoleInfo(`${req.ClientIP} requested the '/blog/register' route`)
});

app.post('/blog/register/post', (req, res) => {
    // Retrieve data from the request body
    const { username, email, password } = req.body;

    const legal_chars = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm',
        'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M',
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '@', '.', '-']

    const containsIllegalUsername = checkIfStringContainsIllegalChar(username, legal_chars);
    const containsIllegalEmail = checkIfStringContainsIllegalChar(email, legal_chars);
    const EmailSyntaxCorrect = checkIfEmailCorrect(email)

    var valid = true
    var reason = ""

    if (username.length > 255) {
        var valid = false
        var reason = "the username can't be longer than 255 chars :/"
        consoleInfo(`${req.ClientIP} tried to register a account that had a username longer than 255 chars`)
    } else if (username.length < 4) {
        var valid = false
        var reason = "the username can't be shorter than 4 chars :P"
        consoleInfo(`${req.ClientIP} tried to register a account that had a username shorter than 4 chars`)
    } else if (containsIllegalUsername == true) {
        var valid = false
        var reason = 'the username contains some banned char/s (if you want me to add char/s, <a href="https://khenzii.dev/">contact me</a>)'
        consoleInfo(`${req.ClientIP} tried to register a account that username's contained a char/chars not in legal_chars`)
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
    }


    if(valid == false){
        res.status(200).send(reason)
        return
    } else{
        consoleInfo(`${req.ClientIP} entered valid info while registering`)
        res.status(200).send("all gut!")
    }

    // do some stuff here (such as write the account to the db) after everything passes
});

// user profiles in /blog
app.get('/blog/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const query = 'SELECT * FROM blog WHERE username = $1';
        const result = await pool.query(query, [username]);

        if (result.rows.length === 0) {
            res.status(404).sendFile(path.join(__dirname, 'html', 'errors', 'error_404.html'));
            consoleInfo(`${req.ClientIP} got the 404 error. Route: /blog/${username}`)
            return
        }

        const user = result.rows[0];
        res.json(user);
    }

    catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Check console for more Details. Sorry.');
        consoleInfo(`${req.ClientIP} got a 500 error. Something probably broke or wasn't working correctly from the start. Route: /blog/${username}`)
    }
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
app.use((err, req, res, next) => {
    res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Check console for more Details. Sorry.');
    consoleInfo(`ClientIP: ${req.ClientIP}. Some internal server error ocurred :/. Here is the error: ${err.stack}`)
});

// Place errors above this comment!


// DONT PUT ROUTES HERE!!!
// if you will put a ordinary route here or some other stuff then
// the error pages would stop working and everything would frick up


app.listen(port, () => {
    console.log(`server waiting for nginx redirects here: http://localhost:${port} 🫡`);
});