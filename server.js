const express = require('express');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.resolve(__dirname, 'secrets.env') });
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const multer = require('multer');
const sanitizeHtml = require('sanitize-html');
const rateLimit = require('express-rate-limit');
const { JSDOM } = require('jsdom');
var svg2img = require('svg2img');
var sharp = require('sharp');


const app = express();
const port = 3000;

const trusted_usernames = ["Khenzii"]
const hours_off = 2
const number_of_posts_to_get = 5
const legal_chars = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm',
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '@', '.', '-', '_']


// allow one IP to access 120 pages / minute
const limit_pages = rateLimit({
    validate: {
        // we trust our beloved nginx :)
        trustProxy: false
    },

    windowMs: 1000 * 60, // 1 minute
    max: 120, // Max number of requests per IP
    message: 'Too many requests from this IP, please try again later. You can access 2 pages / second.',
});

// allow one IP to get 80 responses from the API / minute
const limit_api = rateLimit({
    validate: {
        // we trust our beloved nginx :)
        trustProxy: false
    },

    windowMs: 1000 * 60, // 1 minute
    max: 80, // Max number of requests per IP
    message: 'Too many requests from this IP, please try again later. You can get stuff from the API 80 times / minute.',
});

// allow one IP to change stuff 20 times / minute
const limit_change = rateLimit({
    validate: {
        // we trust our beloved nginx :)
        trustProxy: false
    },

    windowMs: 1000 * 60, // 1 minute
    max: 20, // Max number of requests per IP
    message: 'Too many requests from this IP, please try again later. You can change your stuff 20 times / minute.',
});

// allow one IP to create stuff 10 times / minute
const limit_create = rateLimit({
    validate: {
        // we trust our beloved nginx :)
        trustProxy: false
    },

    windowMs: 1000 * 60, // 1 minute
    max: 10, // Max number of requests per IP
    message: 'Too many requests from this IP, please try again later. You can create stuff 10 times / minute.',
});

// allow one IP to do stuff with the accounts 5 times / minute
const limit_account = rateLimit({
    validate: {
        // we trust our beloved nginx :)
        trustProxy: false
    },

    windowMs: 1000 * 60, // 1 minute
    max: 5, // Max number of requests per IP
    message: 'Too many requests from this IP, please try again later. You can do stuff with accounts 5 times / minute.',
});

const storage = multer.memoryStorage(); // Store the uploaded image in memory
const upload = multer({ storage: storage });

function sanitizeHTML(HTML) {
    const cleanHTML = sanitizeHtml(HTML, {
        allowedTags: [
            'img',
            'video',
            'br'
        ],
        allowedAttributes: {
            'img': ['src', 'alt'],
            'video': ['src', 'alt']
        },
    });

    return cleanHTML
}

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

function consoleInfo(prefix, message) {
    var localDate = getDate(hours_off)

    console.log(`[${prefix}] ${localDate.localDay}/${localDate.localMonth}/${localDate.localYear} - ${localDate.localHours}:${localDate.localMinutes}:${localDate.localSeconds} > ${message}`)
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

const isRevokedCallback = async (req, payload, done) => {
    try {
        const token = (req.cookies && req.cookies.jwt_access_cookie) || req.cookies.jwt_access_cookie_old;
        // get token from the old or new token
        var query = `SELECT * FROM "blacklisted_token" WHERE token = \$1;`
        var result = await pool.query(query, [token]); // query the database

        if (result.rowCount > 0) {
            consoleInfo('W', `${req.ClientIP} tried to use a revoked token!!`)
            return true
        } else {
            return false
        }
    } catch (error) {
        consoleInfo('E', `something went wrong while checking if token is blacklisted, here is the error: ${error}`)
        return false
    }
};

app.use(cookieParser());
const jwt_password = process.env.jwt_password;
// use this middleware for routes that REQUIRE verifictation
const authMiddleware = expressJwt({
    secret: jwt_password,
    algorithms: ['HS256'],
    isRevoked: isRevokedCallback,
    getToken: function (req) {
        const token = (req.cookies && req.cookies.jwt_access_cookie) || req.cookies.jwt_access_cookie_old;
        return token || null;
    }
});

// use this middleware for routes that check if user is verified
const checkAuthMiddleware = async (req, res, next) => {
    try {
        const token = (req.cookies && req.cookies.jwt_access_cookie) || req.cookies.jwt_access_cookie_old;

        // check if there is no token
        if (!token) {
            req.isAuthenticated = false;
            next();
            return;
        }

        // Check if token is revoked (we can't be sure that client-side has deleted the cookie after changing username)
        const isRevoked = await isRevokedCallback(req, jwt.decode(token));
        if (isRevoked) {
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
function checkIfStringContainsIllegalChar(string, legalChars, max_length) {
    if (string.length <= max_length) {
        for (let i = 0; i < string.length; i++) {
            if (legalChars.indexOf(string[i]) === -1) {
                return true; // Found an illegal character
            }
        }
        return false; // All characters are legal
    } else {
        return true
        // user tried to input a too long username,
        // possible DoS attack (or just a too long username)
    }
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
            consoleInfo('E', `Something went wrong while checking if user's password matches, here is the error: ${error}`);
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
        consoleInfo('E', `Something went wrong while writing the user's info to the database, here is the error: ${error}. Username: ${username}.`)
    }
}

async function checkHowMuchEmailIsInTheDatabase(email) {
    try {
        const query = `SELECT username FROM "user" WHERE email = \$1;`
        var result = await pool.query(query, [email]);

        return result.rowCount;
    } catch (error) {
        consoleInfo('E', `Something went wrong while checking how much users use a email, here is the error: ${error}.`)
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
            consoleInfo('i', `${req.ClientIP} tried to log on a account that doesn't exist (usename: ${username}).`)
            return null;
        }
    } catch (error) {
        consoleInfo('E', `Something went wrong while getting a hashed password, here is the error: ${error}.`)
    }
}

// delete post from the database, and reorder the index_in_category accordingly
async function deletePost(post_id) {
    try {
        // remove the post from the database
        var command = `DELETE FROM "post" WHERE id = \$1`
        await pool.query(command, [post_id])

        // reorder the indexes in category
        // (make all of the indexes after deleted one go down 1 row)
        var command = `UPDATE "post" SET index_in_category = index_in_category - 1 WHERE id > \$1`
        await pool.query(command, [post_id])

        return [200, 'Success!'];
    } catch (error) {
        return [500, 'Something went wrong while removing the post from the database :/'];
    }
}

// delete every post using the deletePost function and then delete the category
async function deleteCategory(category_id) {
    try {
        // loop over every post from the category, and delete it
        var query = `SELECT id FROM "post" WHERE category_id = \$1`
        var result = await pool.query(query, [category_id])

        for (let i = 0; i < result.rowCount; i++) {
            var post_id = result.rows[i].id
            await deletePost(post_id)
        }

        // remove the category from the database
        var command = `DELETE FROM "category" WHERE id = \$1`
        await pool.query(command, [category_id])

        return [200, 'Success!'];
    } catch (error) {
        return [500, 'Something went wrong while removing the category from the database :/'];
    }
}

// delete every category using the deleteCategory function and then delete the user
async function deleteUser(user_id, access_cookie) {
    try {
        // remove user bio
        var command = `DELETE FROM "bio" WHERE user_id = \$1;`
        await pool.query(command, [user_id])

        // remove user profile picture (if had one)
        var query = `SELECT id, "default" FROM "profile_picture" WHERE user_id = \$1;`
        var result = await pool.query(query, [user_id])

        var went_wrong = false
        if (result.rows[0].default != "true") {
            const image_path = `./images/blog/${result.rows[0].id}.png`
            fs.unlink(image_path, (err) => {
                if (err) {
                    consoleInfo("E", `Something went wrong while trying to delete user's image. Here is the error: ${err}`)
                    went_wrong = true
                }
            });
        }

        if (went_wrong) {
            return [500, 'Something went wrong while removing your account :/'];
        }

        // clear the profile picture row from database
        var command = `DELETE FROM "profile_picture" WHERE user_id = \$1;`
        await pool.query(command, [user_id]);

        // loop over every category and delete it
        var query = `SELECT id FROM "category" WHERE user_id = \$1`
        var result = await pool.query(query, [user_id])

        for (let i = 0; i < result.rowCount; i++) {
            var category_id = result.rows[i].id
            await deleteCategory(category_id)
        }

        // add the user's token to blacklisted tokens
        var command = `INSERT INTO "blacklisted_token" (user_id, token) VALUES (\$1, \$2);`
        await pool.query(command, [user_id, access_cookie]);

        // remove the user from the database
        var command = `DELETE FROM "user" WHERE id = \$1`
        await pool.query(command, [user_id])

        return [200, 'Success!'];
    } catch (error) {
        consoleInfo("E", `Something went wrong while trying to remove a account, here is the error: ${error}`)
        return [500, 'Something went wrong while removing your account :/'];
    }
}

app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));
app.use('/icons', express.static(path.join(__dirname, 'icons')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/videos', express.static(path.join(__dirname, 'videos')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/robots.txt', express.static(path.join(__dirname, 'robots.txt')));

app.set('trust proxy', true);

app.use(function (req, res, next) {
    var forwarded = req.headers['x-forwarded-for']
    var ips = []

    if (forwarded) {
        ips = forwarded.split(', ')
    } else {
        ips = []
    }

    // get the last IP (always real one, obtained by nginx itself)
    req.ClientIP = ips[ips.length - 1];

    next();
});

app.use(express.json());


// '/' route
app.get('/', limit_pages, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
    consoleInfo('i', `${req.ClientIP} requested the '/' route`)
});

// '/temp' route
app.get('/temp', limit_pages, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'temp_mobile_index.html'));
    consoleInfo('i', `${req.ClientIP} requested the '/temp' route`)
});

// '/mobileinfo' route
app.get('/mobileinfo', limit_pages, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'errors', 'page_not_mobile.html'));
    consoleInfo('i', `${req.ClientIP} requested the '/mobileinfo' route`)
});

// '/projects' route
app.get('/projects', limit_pages, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'pages', 'projects', 'projects.html'));
    consoleInfo('i', `${req.ClientIP} requested the '/projects' route`)
});

// '/projects-2' route
app.get('/projects-2', limit_pages, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'pages', 'projects', 'projects-2.html'));
    consoleInfo('i', `${req.ClientIP} requested the '/projects-2' route`)
});

// '/projects-3' route
app.get('/projects-end', limit_pages, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'pages', 'projects', 'projects-end.html'));
    consoleInfo('i', `${req.ClientIP} requested the '/projects-end' route`)
});

// '/freebobux' route
app.get('/freebobux', limit_pages, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'pages', 'freebobux', 'freebobux.html'));
    consoleInfo('i', `${req.ClientIP} requested the '/freebobux' route :D`)
});

// '/snake' route
app.get('/snake', limit_pages, (req, res) => {
    // res.sendFile(path.join(__dirname, 'html', 'pages', 'snake', 'snake.html'));
    // uncomment the above line later, right now the /snake page
    // is still being build so the route shows the `this page is
    // still being build` html
    res.sendFile(path.join(__dirname, 'html', 'errors', 'page_being_build.html'));
    consoleInfo('i', `${req.ClientIP} requested the '/snake' route`)
});

// '/page_being_build' route
app.get('/page_being_build', limit_pages, (req, res) => {
    // if you are lazy, instead of showing the user the html file
    // using this line of code:
    // res.sendFile(path.join(__dirname, 'html', 'errors', 'page_being_build.html'));
    // you can just redirect to this route :)
    // (however ima still show the html file on other routes when
    // they are being worked on because it gives the user more info
    // redirecting can be confusing)
    res.sendFile(path.join(__dirname, 'html', 'errors', 'page_being_build.html'));
    consoleInfo('i', `${req.ClientIP} requested the '/page_being_build' route`)
});

// '/zsl' route
app.get('/zsl', limit_pages, (req, res) => {
    consoleInfo('i', `${req.ClientIP} requested the '/zsl' route`)
    res.redirect(`/`)
});

// '/zsl/logo' route
app.get('/zsl/logo/', limit_pages, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'pages', 'zsl', 'logo', 'logo.html'))
    consoleInfo('i', `${req.ClientIP} requested the '/zsl/logo' route`)
});

// '/zsl/logo' route
app.get('/zsl/logo/:hex_1', limit_pages, (req, res) => {
    const { hex_1 } = req.params;
    consoleInfo('i', `${req.ClientIP} requested the '/zsl/logo/${hex_1}' route`)

    // Read the HTML file
    fs.readFile(path.join(__dirname, 'html', 'pages', 'zsl', 'logo', 'logo.html'), 'utf8', (error, data) => {
        if (error) {
            consoleInfo('E', `${req.ClientIP} got a 500 error (while trying to read logo.html). Route: '/zsl/logo/${hex_1}'. Error: ${error}`)
            return res.status(500).send("Bruh, something went wrong :P. It isnt your fault. Sorry.");
        }

        /// generate the image (with one hex (the same color for the stroke and fill))
        const svgData = fs.readFileSync('./icons/pages/zsl/logo/zsllolcup.svg', 'utf8');
        const dom = new JSDOM(svgData);
        const svg = dom.window.document.querySelector('svg');

        // change the color of all path's to hex_1
        const paths = svg.querySelectorAll('path');
        paths.forEach(path => {
            path.setAttribute('stroke', `#${hex_1}`);
            if (!(path.parentElement.id === "teeth" || path.parentElement.id === "hair" || path.id === "face" || path.id === "mouth")) {
                path.setAttribute('fill', `#${hex_1}`);
            }
        });

        fs.readdir("./images/zsl/logo/", (err, files) => {
            const fileCount = files.length;

            if (fileCount > 200) {
                res.send("This logo generator has already generated more than 2000 images. To prevent spam / malicious attacks, this is the limit :P")
                consoleInfo("W", `the /zsl/logo route has already generated more than 2000 images!!!`)
                return
            }


            const path = `./images/zsl/logo/${hex_1}`
            const editedSvgData = svg.outerHTML;

            // convert the svg image to png (and save it)
            svg2img(editedSvgData, function (error, pngData) {
                if (error) {
                    consoleInfo(`E`, `Something went wrong while converting the .svg image to .png. Here is the error: ${error}`)
                    return;
                }

                sharp(pngData)
                    .resize(500, 500)
                    .toFile(`${path}.png`, function (error) {
                        if (error) {
                            consoleInfo(`E`, `Something went wrong while converting the .svg image to .png. Here is the error: ${error}`)
                            return;
                        }
                    });
            });

            // Fill out some stuff :)
            var result = data.replace(/<meta property="og:url" content="">/g, `<meta property="og:url" content="https://khenzii.dev/zsl/logo/${hex_1}">`);
            var result = data.replace(/<meta property="og:image" content="">/g, `<meta property="og:image" content="https://khenzii.dev/${path}.png">`);
            var result = data.replace(/<meta name="twitter:image:src" content="">/g, `<meta property="twitter:image:src" content="https://khenzii.dev/${path}.png">`);
            var result = data.replace(/<meta name="theme-color" content="">/g, `<meta property="theme-color" content="#${hex_1}">`);

            // Send the modified HTML back as the response
            res.send(result);
        })
    });
});

// '/zsl/logo' route
app.get('/zsl/logo/:hex_1/:hex_2', limit_pages, (req, res) => {
    const { hex_1, hex_2 } = req.params;
    consoleInfo('i', `${req.ClientIP} requested the '/zsl/logo/${hex_1}/${hex_2}' route`)

    // Read the HTML file
    fs.readFile(path.join(__dirname, 'html', 'pages', 'zsl', 'logo', 'logo.html'), 'utf8', (error, data) => {
        if (error) {
            consoleInfo('E', `${req.ClientIP} got a 500 error (while trying to read logo.html). Route: '/zsl/logo/${hex_1}/${hex_2}'. Error: ${error}`)
            return res.status(500).send("Bruh, something went wrong :P. It isnt your fault. Sorry.");
        }

        /// generate the image (with one hex (the same color for the stroke and fill))
        const svgData = fs.readFileSync('./icons/pages/zsl/logo/zsllolcup.svg', 'utf8');
        const dom = new JSDOM(svgData);
        const svg = dom.window.document.querySelector('svg');

        // change the color of the icon
        const paths = svg.querySelectorAll('path');
        paths.forEach(path => {
            if (path.parentElement.id === "teeth" || path.parentElement.id === "hair" || path.id === "face" || path.id === "mouth") {
                path.setAttribute('stroke', `#${hex_1}`);
            } else {
                path.setAttribute('stroke', `#${hex_2}`);
                path.setAttribute('fill', `#${hex_2}`);
            }
        });

        fs.readdir("./images/zsl/logo/", (err, files) => {
            const fileCount = files.length;

            if (fileCount > 200) {
                res.send("This logo generator has already generated more than 2000 images. To prevent spam / malicious attacks, this is the limit :P")
                consoleInfo("W", `the /zsl/logo route has already generated more than 2000 images!!!`)
                return
            }


            const path = `./images/zsl/logo/${hex_1}_${hex_2}`
            const editedSvgData = svg.outerHTML;

            // convert the svg image to png (and save it)
            svg2img(editedSvgData, function (error, pngData) {
                if (error) {
                    consoleInfo(`E`, `Something went wrong while converting the .svg image to .png. Here is the error: ${error}`)
                    return;
                }

                sharp(pngData)
                    .resize(500, 500)
                    .toFile(`${path}.png`, function (error) {
                        if (error) {
                            consoleInfo(`E`, `Something went wrong while converting the .svg image to .png. Here is the error: ${error}`)
                            return;
                        }
                    });
            });

            // Fill out some stuff :)
            var result = data.replace(/<meta property="og:url" content="">/g, `<meta property="og:url" content="https://khenzii.dev/zsl/logo/${hex_1}/${hex_2}">`);
            var result = data.replace(/<meta property="og:image" content="">/g, `<meta property="og:image" content="https://khenzii.dev/${path}.png">`);
            var result = data.replace(/<meta name="twitter:image:src" content="">/g, `<meta property="twitter:image:src" content="https://khenzii.dev/${path}.png">`);
            var result = data.replace(/<meta name="theme-color" content="">/g, `<meta property="theme-color" content="#${hex_1}">`);

            
            // Send the modified HTML back as the response
            res.send(result);
        })
    });
});


// blog stuff below

// '/blog' route
app.get('/blog', limit_pages, (req, res) => {
    // res.sendFile(path.join(__dirname, 'html', 'pages', 'blog', 'blog.html'));
    consoleInfo('i', `${req.ClientIP} requested the '/blog' route`)
    res.redirect(`/page_being_build`)
});

// '/blog/settings'
app.get('/blog/settings', authMiddleware, limit_pages, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'pages', 'blog', 'settings.html'));
    consoleInfo('i', `${req.ClientIP} requested the '/blog/settings' route, username "${req.auth.username}".`)
});

// '/blog/login' route
app.get('/blog/login', checkAuthMiddleware, limit_pages, (req, res) => {
    if (req.isAuthenticated) {
        res.redirect(`/blog/user/${req.auth.username}`)
        consoleInfo('i', `${req.ClientIP} tried to access the login page while being logged in, username: ${req.auth.username}`)
        return
    }

    res.sendFile(path.join(__dirname, 'html', 'pages', 'blog', 'login.html'));
    consoleInfo('i', `${req.ClientIP} requested the '/blog/login' route`)
});

// '/blog/register' route
app.get('/blog/register', checkAuthMiddleware, limit_pages, (req, res) => {
    if (req.isAuthenticated) {
        res.redirect(`/blog/user/${req.auth.username}`)
        consoleInfo('i', `${req.ClientIP} tried to access the register page while being logged in, username: ${req.auth.username}`)
        return
    }

    res.sendFile(path.join(__dirname, 'html', 'pages', 'blog', 'register.html'));
    consoleInfo('i', `${req.ClientIP} requested the '/blog/register' route`)
});

// redirect from /blog/user
app.get('/blog/user', limit_pages, (req, res) => {
    consoleInfo('i', `${req.ClientIP} tried to get the '/blog/user' route, sending him to '/blog'`)
    res.redirect('/blog');
});

// user profiles in /blog/user (/blog/user/<username>)
app.get('/blog/user/:username', limit_pages, async (req, res) => {
    const { username } = req.params;

    consoleInfo('i', `${req.ClientIP} requested '/blog/user/${username}'.`)

    try {
        const query = `SELECT * FROM "user" WHERE username = \$1;`
        const result = await pool.query(query, [username]);

        if (result.rows.length === 0) {
            res.status(404).sendFile(path.join(__dirname, 'html', 'errors', 'error_404.html'));
            consoleInfo('i', `${req.ClientIP} got the 404 error. Route: '/blog/user/${username}'`)
            return
        }

        res.sendFile(path.join(__dirname, 'html', 'pages', 'blog', 'profile.html'));
    }

    catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Check console for more Details. Sorry.');
        consoleInfo('e', `${req.ClientIP} got a 500 error. Route: '/blog/user/${username}'. Error: ${error}`)
    }
});

// redirect from /blog/post
app.get('/blog/post', limit_pages, (req, res) => {
    consoleInfo('i', `${req.ClientIP} tried to get the '/blog/post' route, sending him to '/blog'`)
    res.redirect('/blog');
});

// posts in /blog/post (/blog/post/<posts_id>)
app.get('/blog/post/:post_id', limit_pages, async (req, res) => {
    const { post_id } = req.params;

    consoleInfo('i', `${req.ClientIP} requested '/blog/post/${post_id}'.`)

    try {
        const query = `SELECT * FROM "post" WHERE id = \$1;`
        const result = await pool.query(query, [post_id]);

        if (result.rows.length === 0) {
            res.status(404).sendFile(path.join(__dirname, 'html', 'errors', 'error_404.html'));
            consoleInfo('i', `${req.ClientIP} got the 404 error. Route: '/blog/post/${post_id}'`)
            return
        }

        res.sendFile(path.join(__dirname, 'html', 'pages', 'blog', 'post.html'));
    } catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Check console for more Details. Sorry.');
        consoleInfo('e', `${req.ClientIP} got a 500 error. Route: '/blog/post/${post_id}'. Error: ${error}`)
    }
});

// Place routes above this comment!!!
// API endpoints below!! :)

// login end-point
app.post('/blog/api/login', limit_account, async (req, res) => {
    const { username, password } = req.body;

    var password_hash = await getHashedPassword(username)

    if (password_hash == null) {
        res.status(200).send(`This username doesn't exist yet! You can register it <a href="/blog/register/">here</a> :)`)
        return
    }

    var authenticated = await checkIfPasswordsMatch(password, password_hash)
    if (authenticated == true) {
        consoleInfo('i', `${req.ClientIP} has successfully logged in! (as "${username}").`)

        // Generate a JWT token
        const token = jwt.sign({ username: username }, jwt_password, { expiresIn: '7d' });

        // Send the token back to the client
        res.cookie('jwt_access_cookie', token, { httpOnly: false, maxAge: 1000 * 60 * 60 * 24 * 7, secure: true, sameSite: "Strict" }); // 7 days expiration
        res.status(200).send(`Successfully logged in! Checkout your page <a href="/blog/user/${username}">here</a> :D`);
    } else {
        consoleInfo('i', `${req.ClientIP} has failed to authenticate (tried to as "${username}").`)
        res.status(200).send(`Wrong password! :/`)
    }
});

// registeration end-point
app.post('/blog/api/register', limit_account, async (req, res) => {
    // Retrieve data from the request body
    const { username, email, password } = req.body;

    const containsIllegalUsername = checkIfStringContainsIllegalChar(username, legal_chars, max_length = 20);
    // i doubt that anyone uses a email longer than 75 chars
    const containsIllegalEmail = checkIfStringContainsIllegalChar(email, legal_chars, max_length = 75);
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
        consoleInfo('i', `${req.ClientIP} tried to register a account that had a username longer than 20 chars`)
    } else if (username.length < 4) {
        var valid = false
        var reason = "the username can't be shorter than 4 chars :P"
        consoleInfo('i', `${req.ClientIP} tried to register a account that had a username shorter than 4 chars`)
    } else if (containsIllegalUsername == true) {
        var valid = false
        var reason = 'the username contains some banned char/s (if you want me to add char/s, <a href="/">contact me</a>)'
        consoleInfo('i', `${req.ClientIP} tried to register a account that username's contained a char/chars not in legal_chars`)
    } else if (usernameAlreadyRegistered == true) {
        var valid = false
        var reason = 'the username is already taken ;/'
        consoleInfo('i', `${req.ClientIP} tried to register a account that username's was already taken`)
    }

    else if (password.length < 5) {
        var valid = false
        var reason = "the password can't be shorter than 5 chars :/"
        consoleInfo('i', `${req.ClientIP} tried to register a account that had a password shorter than 5 chars`)
    }

    else if (email.length < 5) {
        var valid = false
        var reason = "lmao, nice email, buddy."
        consoleInfo('i', `${req.ClientIP} tried to register a account that had a email shorter than 5 chars`)
    } else if (containsIllegalEmail == true) {
        var valid = false
        var reason = 'the email contains some banned char/s (if you want me to add char/s, <a href="https://khenzii.dev/">contact me</a>)'
        consoleInfo('i', `${req.ClientIP} tried to register a account that email's contained a char/chars not in legal_chars`)
    } else if (EmailSyntaxCorrect == false) {
        var valid = false
        var reason = "make sure to enter the correct email :)"
        consoleInfo('i', `${req.ClientIP} tried to register a account with an incorrect email`)
    } else if (EmailHasTooMuchAccounts == true) {
        var valid = false
        var reason = "Too many accounts (3) use this email. Sorry!"
        consoleInfo('i', `${req.ClientIP} tried to register a account with an over-used email`)
    }


    if (!valid) {
        res.status(200).send(reason)
        return
    }


    consoleInfo('i', `${req.ClientIP} entered valid info while registering`)

    try {
        await register_account(username, email, password)

        // Generate a JWT token
        const token = jwt.sign({ username: username }, jwt_password, { expiresIn: '7d' });
        // Send the token back to the client
        res.cookie('jwt_access_cookie', token, { httpOnly: false, maxAge: 1000 * 60 * 60 * 24 * 7, secure: true, sameSite: "Strict" }); // 7 days expiration

        consoleInfo('i', `registered a new account with username: ${username}`)
        res.status(200).send(`your account should be ready <a href="/blog/user/${username}">here</a> (in a moment :>)`)
    } catch (error) {
        consoleInfo('E', `something went wrong while registering the account. Here is the error: ${error}.`)
        res.status(500)
    }
});

// retrieve stuff about user
app.post('/blog/api/get_user', checkAuthMiddleware, limit_api, async (req, res) => {
    try {
        // Retrieve data from the request body
        const username = req.body[0];

        // initialize the object that we will later return (it will contain all of the data)
        var data = {}

        // run the SQL queries
        // the first one is for user_id and joined_at
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

        if (default_setting == "true") {
            var image = "/icons/pages/blog/pfp_placeholder.png"
        } else {
            // if user has a custom profile picture, get it's name
            var query = `SELECT id FROM "profile_picture" WHERE user_id = \$1;`
            var result = await pool.query(query, [user_id]);

            var name = result.rows[0].id

            var image = `/images/blog/${name}.png`
        }

        data.image = image

        // the third one for user's bio and links
        var query = `SELECT text_value, links FROM "bio" WHERE user_id = \$1;`
        var result = await pool.query(query, [user_id]);

        const bio_and_links = result.rows[0]
        data.bio_and_links = bio_and_links;

        // the forth one for user's categories
        var query = `SELECT * FROM "category" WHERE user_id = \$1 ORDER BY id;`
        var result = await pool.query(query, [user_id]);

        var categories = ""

        if (result.rowCount > 0) {
            categories = result.rows
        } else {
            categories = "404"
        }
        data.categories = categories;

        data.logged_in_as_user = false // if user is owner of the username
        data.logged_in = false // if user is completely not logged in (no cookie)
        if (req.isAuthenticated) {
            data.logged_in = true
            if (req.auth.username == username) {
                data.logged_in_as_user = true
            }
        }

        res.status(200).send(data)
    } catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Check console for more Details. Sorry.');
        consoleInfo('e', `${req.ClientIP} got a 500 error (while communicating with the back-end). Error: ${error}.`)
    }
});

// retrieve user's username using user id
app.post('/blog/api/get_username', limit_api, async (req, res) => {
    try {
        // Retrieve data from the request body
        const id = req.body[0];

        // get the username
        var query = `SELECT username FROM "user" WHERE id = \$1;`
        var result = await pool.query(query, [id]);

        const username = result.rows[0].username

        res.status(200).send(username)
    } catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Check console for more Details. Sorry.');
        consoleInfo('e', `${req.ClientIP} got a 500 error (while communicating with the back-end). Error: ${error}.`)
    }
});

// retrieve stuff about user (this endpoint is being used by settings (it's not requesting useless stuff such as categories like get_user endpoint))
app.post('/blog/api/get_user_settings', authMiddleware, limit_api, async (req, res) => {
    try {
        // initialize the object that we will later return (it will contain all of the data)
        var data = {}

        username = req.auth.username
        data.username = username

        // run the SQL queries
        // the first one is for user_id
        var query = `SELECT id FROM "user" WHERE username = \$1;`
        var result = await pool.query(query, [username]);

        const user_id = result.rows[0].id
        data.user_id = user_id;

        // the second one for user's profile picture
        var query = `SELECT "default" FROM "profile_picture" WHERE user_id = \$1;`
        var result = await pool.query(query, [user_id]);

        const default_setting = result.rows[0].default

        var image = ""

        if (default_setting == "true") {
            var image = "/icons/pages/blog/pfp_placeholder.png"
        } else {
            // if user has a custom profile picture, get it's name
            var query = `SELECT id FROM "profile_picture" WHERE user_id = \$1;`
            var result = await pool.query(query, [user_id]);

            var name = result.rows[0].id

            var image = `/images/blog/${name}.png`
        }

        data.image = image

        // the third one for user's bio and links
        var query = `SELECT text_value, links FROM "bio" WHERE user_id = \$1;`
        var result = await pool.query(query, [user_id]);

        const bio_and_links = result.rows[0]
        data.bio_and_links = bio_and_links;

        res.status(200).send(data)
    } catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Check console for more Details. Sorry.');
        consoleInfo('e', `${req.ClientIP} got a 500 error (while communicating with the back-end). Error: ${error}. Route: "/blog/api/get_user_settings"`)
    }
});

// retrieve posts from a category
app.post('/blog/api/get_posts', limit_api, async (req, res) => {
    try {
        // Retrieve data from the request body
        const { category_id, times } = req.body;

        // get <number_of_posts_to_get> posts from the category, sorted by the 
        // newest, with the offset of <number_of_posts_to_get> * <times>
        var query = `SELECT * FROM "post" WHERE category_id = \$1 ORDER BY id DESC LIMIT ${number_of_posts_to_get} OFFSET \$2;`
        var result = await pool.query(query, [category_id, number_of_posts_to_get * times])

        result.number_of_posts_to_get = number_of_posts_to_get

        res.status(200).send(result)
    } catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Check console for more Details. Sorry.');
        consoleInfo('e', `${req.ClientIP} got a 500 error (while communicating with the back-end). Error: ${error}.`)
    }
});

// retrieve info about a certain post
app.post('/blog/api/get_post', limit_api, async (req, res) => {
    try {
        // Retrieve data from the request body
        const post_id = req.body[0];

        // get the post from the db
        var query = `SELECT * FROM "post" WHERE id = \$1;`
        var result = await pool.query(query, [post_id])

        res.status(200).send(result)
    } catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Check console for more Details. Sorry.');
        consoleInfo('e', `${req.ClientIP} got a 500 error (while communicating with the back-end). Error: ${error}.`)
    }
});

// retrieve info about a certain category
app.post('/blog/api/get_category', limit_api, async (req, res) => {
    try {
        // Retrieve data from the request body
        const category_id = req.body[0];

        // get the category from the db
        var query = `SELECT * FROM "category" WHERE id = \$1;`
        var result = await pool.query(query, [category_id])

        res.status(200).send(result)
    } catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Check console for more Details. Sorry.');
        consoleInfo('e', `${req.ClientIP} got a 500 error (while communicating with the back-end). Error: ${error}.`)
    }
});

// create category
app.post('/blog/api/create_category', authMiddleware, limit_create, async (req, res) => {
    try {
        // Retrieve data from the request body
        const { user_id, categoryTitle, categoryDescription } = req.body;

        // 1. check if req.auth.username = user_id's username (we don't want people to create categories on others accounts ;D)
        var query = `SELECT username FROM "user" WHERE id = \$1;`
        var result = await pool.query(query, [user_id]);

        if (req.auth.username == result.rows[0].username) {
            // 2. check if over character limit
            if (categoryTitle.length > 30 && !trusted_usernames.includes(req.auth.username)) {
                res.status(400).send(`The category title can't be longer than 30 characters. Sorry.`);
                consoleInfo('i', `${req.ClientIP} aka ${req.auth.username} tried to create a category that had a title longer than 30 characters.`)
                return
            }

            if (categoryDescription.length > 200 && !trusted_usernames.includes(req.auth.username)) {
                res.status(400).send(`The category description can't be longer than 200 characters. Sorry.`);
                consoleInfo('i', `${req.ClientIP} aka ${req.auth.username} tried to create a category that had a description longer than 200 characters.`)
                return
            }

            // 3. sanitze the HTML
            if (trusted_usernames.includes(req.auth.username)) {
                // if user is trusted
                var cleanCategoryTitle = categoryTitle;
                var cleanCategoryDescription = categoryDescription;
            } else {
                // else
                var cleanCategoryTitle = sanitizeHTML(categoryTitle);
                var cleanCategoryDescription = sanitizeHTML(categoryDescription);
            }

            // get index_in_user
            var query = `SELECT id FROM "category" WHERE user_id = \$1;`
            var result = await pool.query(query, [user_id]);

            var index_in_user = result.rowCount + 1

            // 4. write to the db
            var command = `INSERT INTO "category" (user_id, title, description, index_in_user) VALUES (\$1, \$2, \$3, \$4);`
            await pool.query(command, [user_id, cleanCategoryTitle, cleanCategoryDescription, index_in_user])

            res.status(200).send("Success!")
        } else {
            res.status(403).send("Access Denied!")
        }
    } catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Check console for more Details. Sorry.');
        consoleInfo('e', `${req.ClientIP} got a 500 error (while communicating with the back-end). Error: ${error}.`)
    }
});

// create post
app.post('/blog/api/create_post', authMiddleware, limit_create, async (req, res) => {
    try {
        // Retrieve data from the request body
        const { category_id, text_value } = req.body;

        // 1. check if authMiddleware.username = user_id's username (we don't want people to create posts on others accounts ;D)
        // get the user_id using category_id
        var query = `SELECT user_id FROM "category" WHERE id = \$1;`
        var result = await pool.query(query, [category_id]);

        // get the username using user_id
        var query = `SELECT username FROM "user" WHERE id = \$1;`
        var result = await pool.query(query, [result.rows[0].user_id]);

        if (req.auth.username == result.rows[0].username) {
            // 2. check if over character limit
            if (text_value.length > 1000 && !trusted_usernames.includes(req.auth.username)) {
                res.status(400).send(`The post content can't be longer than 1000 characters. Sorry.`);
                consoleInfo('i', `${req.ClientIP} aka ${req.auth.username} tried to create a post that was longer than 1000 chars.`)
                return
            }

            // 4. get aditional variables
            // get the current date and create created_at using it
            var localDate = getDate(hours_off)
            var created_at = `${localDate.localDay}/${localDate.localMonth}/${localDate.localYear} - ${localDate.localHours}:${localDate.localMinutes}:${localDate.localSeconds}`

            // get the next index in category
            var query = `SELECT index_in_category FROM "post" WHERE category_id = \$1 ORDER BY id DESC;`
            var result = await pool.query(query, [category_id]);

            if (result.rowCount > 0) {
                var index_in_category = result.rows[0].index_in_category + 1
            } else {
                var index_in_category = 1
            }

            // clean the HTML
            if (trusted_usernames.includes(req.auth.username)) {
                // if user is trusted
                var cleanHTML = text_value;
            } else {
                // else
                var cleanHTML = sanitizeHTML(text_value);
            }

            // 5. write to the db
            var command = `INSERT INTO "post" (category_id, text_value, created_at, index_in_category) VALUES (\$1, \$2, \$3, \$4);`
            await pool.query(command, [category_id, cleanHTML, created_at, index_in_category])

            res.status(200).send("Success!")
        } else {
            res.status(403).send("Access Denied!")
        }
    } catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Sorry.');
        consoleInfo('e', `${req.ClientIP} got a 500 error (while communicating with the back-end). Error: ${error}.`)
    }
});

// change profile picture
app.post('/blog/api/change_pfp', authMiddleware, upload.single('new_pfp'), limit_change, async (req, res) => {
    try {
        // Retrieve data from the request body
        const { user_id } = req.body;

        if (!req.file) {
            return res.status(400).send("No image selected! :P")
        }

        // 1. verify the user
        // get the username using user_id
        var query = `SELECT username FROM "user" WHERE id = \$1;`
        var result = await pool.query(query, [user_id]);

        // check if requestor's username = user_id username
        if (req.auth.username == result.rows[0].username) {
            // 2. get the profile pictures id
            var query = `SELECT id FROM "profile_picture" WHERE user_id = \$1;`
            var result = await pool.query(query, [user_id]);

            const image_id = result.rows[0].id

            // 3. write to the db (deafult "false", user_id "<what_ever_user_id>")
            var command = `UPDATE "profile_picture" SET "default" = \$1 WHERE user_id = \$2`
            await pool.query(command, ["nah", user_id]);

            // 4. save the image with appropiate filename
            const uploadedImage = req.file.buffer; // Image binary data
            const uniqueFileName = `${image_id}.png`;
            fs.writeFileSync(`images/blog/${uniqueFileName}`, uploadedImage);

            res.status(200).send('Success!');
        } else {
            res.status(403).send("Access Denied!")
        }
    } catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Sorry.');
        consoleInfo('e', `${req.ClientIP} got a 500 error (while communicating with the back-end). Error: ${error}.`)
    }
});

// change username
app.post('/blog/api/change_username', authMiddleware, limit_change, async (req, res) => {
    try {
        // Retrieve data from the request body
        const { user_id, text_value } = req.body;

        // 1. check if the  user is authenticated
        // get the username using user_id
        var query = `SELECT username FROM "user" WHERE id = \$1;`
        var result = await pool.query(query, [user_id]);

        if (req.auth.username == result.rows[0].username) {
            // 2. check if the username is okay :thumbsup:
            const usernameAlreadyRegistered = await checkIfUsernameTaken(text_value)
            const containsIllegalUsername = checkIfStringContainsIllegalChar(text_value, legal_chars, max_length = 20);

            var valid = true
            var reason = ""

            if (text_value.length > 20) {
                var valid = false
                var reason = "the username can't be longer than 20 chars :/"
                consoleInfo('i', `${req.ClientIP} tried to change username to a username that was longer than 20 chars`)
            } else if (text_value.length < 4) {
                var valid = false
                var reason = "the username can't be shorter than 4 chars :P"
                consoleInfo('i', `${req.ClientIP} tried to change username to a shorter one than 4 chars`)
            } else if (containsIllegalUsername) {
                var valid = false
                var reason = 'the username contains some banned char/s (if you want me to add char/s, <a href="/">contact me</a>)'
                consoleInfo('i', `${req.ClientIP} tried to change username to a username that contained a char/chars not in legal_chars`)
            } else if (usernameAlreadyRegistered) {
                var valid = false
                var reason = 'the username is already taken ;/'
                consoleInfo('i', `${req.ClientIP} tried to change username to a username that already exists`)
            }

            if (!valid) {
                res.status(200).send(reason)
                return
            }

            // 3. change the username in the database
            var command = `UPDATE "user" SET username = \$1 WHERE id = \$2`
            await pool.query(command, [text_value, user_id]);

            // 4. send the client a new auth token
            // Generate a JWT token
            const token = jwt.sign({ username: text_value }, jwt_password, { expiresIn: '7d' });

            // Send the token back to the client
            res.cookie('jwt_access_cookie', token, { httpOnly: false, maxAge: 1000 * 60 * 60 * 24 * 7, secure: true, sameSite: "Strict" }); // 7 days expiration

            // 5. add the old token to the blacklist
            var command = `INSERT INTO "blacklisted_token" (user_id, token) VALUES (\$1, \$2);`
            await pool.query(command, [user_id, req.cookies.jwt_access_cookie_old]);
            res.status(200).send("Success!")
        } else {
            res.status(403).send("Access Denied!")
        }
    } catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Sorry.');
        consoleInfo('e', `${req.ClientIP} got a 500 error (while communicating with the back-end). Error: ${error}.`)
    }
});

// change bio
app.post('/blog/api/change_bio', authMiddleware, limit_change, async (req, res) => {
    try {
        // Retrieve data from the request body
        const { user_id, text_value } = req.body;

        // 1. verify the user
        // (by checking that req.auth.username == user id's username)

        // get the username
        var query = `SELECT username FROM "user" WHERE id = \$1;`
        var result = await pool.query(query, [user_id]);

        if (req.auth.username == result.rows[0].username) {
            // 2. check stuff
            if (text_value.length > 300 && !trusted_usernames.includes(req.auth.username)) {
                res.status(400).send("The bio can't be longer than 300 chars :P")
                consoleInfo('i', `${req.ClientIP} aka ${req.auth.username} tried to change their's bio to something longer than 200 characters.`)
                return
            }

            // 3. write to the database
            var command = `UPDATE "bio" SET text_value = \$1 WHERE user_id = \$2`
            await pool.query(command, [text_value, user_id]);

            res.status(200).send("Success!")
        } else {
            res.status(403).send("Access denied!")
        }
    } catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Sorry.');
        consoleInfo('e', `${req.ClientIP} got a 500 error (while communicating with the back-end). Error: ${error}.`)
    }
});

// change category index
app.post('/blog/api/change_category_index', authMiddleware, limit_change, async (req, res) => {
    try {
        // Retrieve data from the request body
        const { user_id, first_category_index, second_category_index } = req.body;

        // 1. verify the user
        // (by checking that req.auth.username == user id's username)

        // get the username
        var query = `SELECT username FROM "user" WHERE id = \$1;`
        var result = await pool.query(query, [user_id]);

        if (req.auth.username == result.rows[0].username) {
            // get first and second category id's
            var query = `SELECT id FROM "category" WHERE user_id = \$1 AND index_in_user = \$2`
            var result = await pool.query(query, [user_id, first_category_index]);

            var first_category_id = result.rows[0].id

            var query = `SELECT id FROM "category" WHERE user_id = \$1 AND index_in_user = \$2`
            var result = await pool.query(query, [user_id, second_category_index]);

            var second_category_id = result.rows[0].id

            // 3. replace the first index with a second one and the second one with the first one
            // replace the first category index_in_user with the second one
            var command = `UPDATE "category" SET "index_in_user" = \$1 WHERE id = \$2`
            await pool.query(command, [second_category_index, first_category_id]);

            // replace the second category index_in_user with the first one
            var command = `UPDATE "category" SET "index_in_user" = \$1 WHERE id = \$2`
            await pool.query(command, [first_category_index, second_category_id]);

            res.status(200).send("Success!")
        } else {
            res.status(403).send("Access denied!")
        }
    } catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Sorry.');
        consoleInfo('e', `${req.ClientIP} got a 500 error (while communicating with the back-end). Error: ${error}.`)
    }
});

// delete post
app.post('/blog/api/delete_post', authMiddleware, limit_change, async (req, res) => {
    try {
        // Retrieve data from the request body
        const { post_id } = req.body;

        // 1. verify the user
        // (by checking that req.auth.username == post's categories user id's username)

        // get the category_id
        var query = `SELECT category_id FROM "post" WHERE id = \$1`
        var result = await pool.query(query, [post_id]);

        // get the user id using category's id
        var query = `SELECT user_id FROM "category" WHERE id = \$1`
        var result = await pool.query(query, [result.rows[0].category_id]);

        // get the user's username using the user's id
        var query = `SELECT username FROM "user" WHERE id = \$1`
        var result = await pool.query(query, [result.rows[0].user_id]);

        if (req.auth.username == result.rows[0].username) {
            var message = await deletePost(post_id);

            res.status(message[0]).send(message[1])
        } else {
            res.status(403).send("Access denied!")
        }
    } catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Sorry.');
        consoleInfo('e', `${req.ClientIP} got a 500 error (while communicating with the back-end). Error: ${error}.`)
    }
});

// delete category
app.post('/blog/api/delete_category', authMiddleware, limit_change, async (req, res) => {
    try {
        // Retrieve data from the request body
        const { category_id } = req.body;

        // 1. verify the user
        // (by checking that req.auth.username == categories user id username)

        // get the user id using category's id
        var query = `SELECT user_id FROM "category" WHERE id = \$1`
        var result = await pool.query(query, [category_id]);

        // get the user's username using the user's id
        var query = `SELECT username FROM "user" WHERE id = \$1`
        var result = await pool.query(query, [result.rows[0].user_id]);

        if (req.auth.username == result.rows[0].username) {
            var message = await deleteCategory(category_id);

            res.status(message[0]).send(message[1])
        } else {
            res.status(403).send("Access denied!")
        }
    } catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Sorry.');
        consoleInfo('e', `${req.ClientIP} got a 500 error (while communicating with the back-end). Error: ${error}.`)
    }
});

// delete user
app.post('/blog/api/delete_user', authMiddleware, limit_change, async (req, res) => {
    try {
        // Retrieve data from the request body
        const { user_id } = req.body;

        // 1. verify the user
        // (by checking that req.auth.username == user id's username)

        // get the username
        var query = `SELECT username FROM "user" WHERE id = \$1;`
        var result = await pool.query(query, [user_id]);

        if (req.auth.username == result.rows[0].username) {
            if (req.cookies.jwt_access_cookie) {
                var message = await deleteUser(user_id, req.cookies.jwt_access_cookie);
            } else {
                var message = await deleteUser(user_id, req.cookies.jwt_access_cookie_old);
            }

            res.status(message[0]).send(message[1])
        } else {
            res.status(403).send("Access denied!")
        }
    } catch (error) {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Sorry.');
        consoleInfo('e', `${req.ClientIP} got a 500 error (while communicating with the back-end). Error: ${error}.`)
    }
});


// 404 error
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'html', 'errors', 'error_404.html'));
    consoleInfo('e', `${req.ClientIP} got the 404 error`)
});

// Default error handler
app.use(function (error, req, res, next) {
    if (error.name === "UnauthorizedError") {
        res.redirect("/blog/login");
        consoleInfo('w', `${req.ClientIP} tried to do stuff while lacking authentication.`)
    } else {
        res.status(500).send('Bruh, something went wrong :P. It isnt your fault. Check console for more Details. Sorry.');
        consoleInfo('E', `${req.ClientIP} some internal server error ocurred :/. Here is the error: ${error.stack}`)
    }
});

// Place errors above this comment!


// DONT PUT ROUTES HERE!!!
// if you will put a ordinary route here or some other stuff then
// the error pages would stop working


app.listen(port, () => {
    consoleInfo(`i`, `Some info:`)
    consoleInfo(`i`, `Logs are marked with these symbols: '[i]', '[w]', '[W]', '[e]', '[E]'`)
    consoleInfo(`i`, `[i] - info`)
    consoleInfo(`i`, `[w] - warning`)
    consoleInfo(`i`, `[W] - severe warning`)
    consoleInfo(`i`, `[e] - error`)
    consoleInfo(`i`, `[E] - severe error`)
    consoleInfo(`i`, `end of info! \n`)

    consoleInfo(`i`, `current settings:`)
    consoleInfo(`i`, `1. using the UTC+${hours_off} timezone, you can change this setting by modifying the hours_off variable inside of server.js.`)
    consoleInfo(`i`, `2. trusted_usernames: ${trusted_usernames} (these usernames can post long posts and use HTML on /blog), you can change this setting by modifying the trusted_usernames variable inside of server.js.`)
    consoleInfo(`i`, `3. number_of_posts_to_get: ${number_of_posts_to_get} (this setting makes the /blog/api/get_posts endpoint return ${number_of_posts_to_get} posts), you can change this setting by modifying the number_of_posts_to_get variable inside of server.js.`)
    consoleInfo(`i`, `end of settings! \n`)

    consoleInfo(`i`, `server waiting for nginx redirects here: http://localhost:${port} 🫡 \n \n \n`)
});