const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

function getMilliseconds(hours){ // returns the milliseconds that there are in certain amount of hours
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
    var localMonth = addZero(currentPolishTime.getMonth()+1); // months start from the index 0, so we are adding 1
    var localDay = addZero(currentPolishTime.getDate());
    var localHours = addZero(currentPolishTime.getHours());
    var localMinutes = addZero(currentPolishTime.getMinutes());
    var localSeconds = addZero(currentPolishTime.getSeconds());

    console.log(`${localDay}/${localMonth}/${localYear.toString().slice(-2)} - ${localHours}:${localMinutes}:${localSeconds} > ${message}`)
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
        req.ip = ClientIP;
    } else {
        req.ip = "<empty_string>"
    }
    
    next();
});


// '/' route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
    consoleInfo(`${req.ip} requested the '/' route`)
});

// '/temp' route
app.get('/temp', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'temp_mobile_index.html'));
    consoleInfo(`${req.ip} requested the '/temp' route`)
});

// '/mobileinfo' route
app.get('/mobileinfo', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'errors', 'page_not_mobile.html'));
    consoleInfo(`${req.ip} requested the '/mobileinfo' route`)
});

// '/blog' route
app.get('/blog', (req, res) => {
    // res.sendFile(path.join(__dirname, 'html', 'pages', 'blog', 'blog.html'));
    // uncomment the above line later, right now the /blog page is
    // still being build so the route shows the `this page is still
    // being build` html
    res.sendFile(path.join(__dirname, 'html', 'errors', 'page_being_build.html'));
    consoleInfo(`${req.ip} requested the '/blog' route`)
});

// '/projects' route
app.get('/projects', (req, res) => {
    // res.sendFile(path.join(__dirname, 'html', 'pages', 'projects', 'projects.html'));
    // uncomment the above line later, right now the /projects page 
    // is still being build so the route shows the `this page is
    // still being build` html
    res.sendFile(path.join(__dirname, 'html', 'errors', 'page_being_build.html'));
    consoleInfo(`${req.ip} requested the '/projects' route`)
});

// '/freebobux' route
app.get('/freebobux', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'pages', 'freebobux', 'freebobux.html'));
    consoleInfo(`${req.ip} requested the '/freebobux' route :D`)
});

// '/snake' route
app.get('/snake', (req, res) => {
    // res.sendFile(path.join(__dirname, 'html', 'pages', 'snake', 'snake.html'));
    // uncomment the above line later, right now the /snake page
    // is still being build so the route shows the `this page is
    // still being build` html
    res.sendFile(path.join(__dirname, 'html', 'errors', 'page_being_build.html'));
    consoleInfo(`${req.ip} requested the '/snake' route`)
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
    consoleInfo(`${req.ip} requested the '/page_being_build' route`)
});

// Place routes above this comment!!!

// 404 error
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'html', 'errors', 'error_404.html'));
    consoleInfo(`${req.ip} got the 404 error`)
});

// Default error handler
app.use((err, req, res, next) => {
    res.status(500).send('Bruh, something went wrong :P Check console for more Details. Sorry.');
    consoleInfo(`ClientIP: ${req.ip}. Some internal server error ocurred :/. Here is the error: ${err.stack}`)
});

// Place errors above this comment!


// DONT PUT ROUTES HERE!!!
// if you will put a ordinary route here or some other stuff then
// the error pages would stop working and everything would frick up


app.listen(port, () => {
    console.log(`app waiting for nginx redirects here: http://localhost:${port} 🫡`);
});