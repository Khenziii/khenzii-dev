# khenzii.dev
<a href="https://khenzii.dev/">khenzii.dev</a> is my personal portfolio :). It runs on a VPS that i rent from <a href="https://vultr.com">vultr.com</a>.

## VPS's Specs
For everyone wondering, here are the specs:

- **OS** - Ubuntu 22.04
- **Processing Power** - 1vCPU
- **RAM** - 1GB
- **Storage** - 25GB SSD
- **Bandwidth** - 1TB

I pay 6$/month for it, but i think that it's worth it as i also host a couple of my side projects on it. If you know a more valuable deal, don't be shy and contact me - you can find the contact info <a href="https://khenzii.dev">here</a>.

## Technologies
At the moment, the website is using <a href="https://github.com/nginx/nginx">nginx</a> as a reverse proxy and <a href="https://github.com/nodejs/node">Node.js</a> for the backend (i don't plan to change these technologies in the nearest time, they serve me well :>). It is also using the PEN (yeah, i know, das a pretty cool name) stack (<a href="https://github.com/postgres/postgres">PostgreSQL</a>, <a href="https://github.com/expressjs/express">Express.js</a>, <a href="https://github.com/nodejs/node">Node.js</a>). In the future i plan to also use <a href="https://github.com/sveltejs/svelte">Svelte</a> and <a href="https://github.com/jestjs/jest">Jest</a>. The process manager that i use in production is <a href="https://github.com/Unitech/pm2">pm2</a>.

## Features
Overtime, i plan to make <a href="https://khenzii.dev/">khenzii.dev</a> a place in which i would be able to easily showcase and talk about my projects - some of my projects will even live there! Right now, here are the avaible features:

- **/freebobux** - have you ever REALLY wanted to rickroll someone, but didn't know how? If so, i really recommend you visiting <a href="https://khenzii.dev/freebobux">khenzii.dev/freebobux</a> :).

## Contributing | IMPORTANT!!!
Please, read this carefully before spending your time creating cool stuff: The whole project is meant to be my portfolio, so i will sadly have to ignore PR's that add things that aren't already on the website :/. However, if you really want to help, you can always try to find some bugs, or even a typo in some text - i will be really happy to merge those PR's :).

## TO-DO list:

- **/blog** - the /blog route is a really big project (at least for a hobbyist without a team like me). It will be something like twitter, but with extra features. I want to finish this thing before getting into anything else because /blog would allow me to document everything new that I will be writing in the future.
- **the search for console.logs()** - after writing the /blog route, i think that i'm going to go through client-side scripts and find some of the console.log's that i forgot to get rid of while programming.
- **license info** - even though that this GitHub repo (with LICENSE file) is mentioned on the website as it's source-code, people could still argue that they didn't visit the /projects-end route and didn't saw the repo (thus didn't knew about the CC-BY-SA 4.0 license). That's why i think that i'm going to put meta tags indicating the license and a "license" footer on the index page.
- **rate limits** - right now the routes don't have any rate-limits (and that's VERY bad), ima add some later.
- **email verification** - a email can be linked with 3 accounts at a single time - but we're not verifying if the emails really belong to the user. This means that people could potentially create 3 accounts with a email and then someone that would like to use this email won't be able to. To fix this i will only be counting verified emails to the accounts number.
- **archiver.py logs** - i'll make the logs better latter.
- **/blog links** - profile links / connections and stuff.
- **SEO** - adding alt tags to the images and meta tags to heads will be a pretty good thing to do.
- **info, error, etc. - server logs** - tags like [i] indicating that a log is informational or [e] indicating that something went wrong will be useful.
- **Website design** - some basic changes, like using a constant margin between elements, etc. I don't have time for it now, but i'm for sure going to do it after the previous points.
- **/snake** - I was thinking about creating a route in which users could train an AI model using client's side JavaScript.
- **premium accounts for /blog users** - sadly, I live in Poland, so the 6$ is actually ~25PLN (and yes, the average monthly income in Poland is 5000PLN, basically everything on the internet costs 4.5 times more for Poles). It kinda is a lot for a teenager without a job like me, and that's why I came up with an idea of premium blog users. Don't get me wrong, I'm not pulling an Elon move (like not allowing free users to view more than 600 posts per day) - this will be more kind of a support button, but with actual pros that would make me feel better for asking folks for money (I think that a support button is a lot better than putting tens of Google's ads on the website).