const express = require('express');
const path = require('path');

const app = express();
const port = 3000;


app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));
app.use('/icons', express.static(path.join(__dirname, 'icons')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/video', express.static(path.join(__dirname, 'video')));
app.use('/robots.txt', express.static(path.join(__filename, 'robots.txt')));

// '/' route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

// '/temp' route
app.get('/temp', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'temp_mobile_index.html'));
});

// '/mobileinfo' route
app.get('/mobileinfo', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'errors', 'page_not_mobile.html'));
});

// '/blog' route
app.get('/blog', (req, res) => {
    // res.sendFile(path.join(__dirname, 'html', 'pages', 'blog', 'blog.html'));
    // uncomment the above line later, right now the /blog page is
    // still being build so the route shows the "this page is still
    // being build" html
    res.sendFile(path.join(__dirname, 'html', 'errors', 'page_being_build.html'));
});

// '/projects' route
app.get('/projects', (req, res) => {
    // res.sendFile(path.join(__dirname, 'html', 'pages', 'projects', 'projects.html'));
    // uncomment the above line later, right now the /projects page 
    // is still being build so the route shows the "this page is
    // still being build" html
    res.sendFile(path.join(__dirname, 'html', 'errors', 'page_being_build.html'));
});

// '/freebobux' route
app.get('/freebobux', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'pages', 'freebobux', 'freebobux.html'));
});

// '/snake' route
app.get('/snake', (req, res) => {
    // res.sendFile(path.join(__dirname, 'html', 'pages', 'snake', 'snake.html'));
    // uncomment the above line later, right now the /snake page
    // is still being build so the route shows the "this page is
    // still being build" html
    res.sendFile(path.join(__dirname, 'html', 'errors', 'page_being_build.html'));
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
});

// Place routes above this comment!!!

// 404 error
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'html', 'errors', 'error_404.html'));
});

// Default error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Bruh, something went wrong :P Check console for more Details. Sorry.');
});

// Place errors above this comment!


// DONT PUT ROUTES HERE!!!
// if you will put a ordinary route here or some other stuff then
// the error pages would stop working and everything would frick up


app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});