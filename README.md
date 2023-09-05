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
- **rate limits** - right now the routes don't have any rate-limits (and that's VERY bad), ima add some later.
- **/blog webarchive** - i think that i will spend A LOT of time on the /blog route, so it will be nice to have the whole history backedup on the webarchive. I have heard that they have an open API, ima check it out later.
- **/projects** - the /projects route will showcase my projects and previous experience with programming.
- **adding some cool effect to the index page** - i have came up with a cool replacement for the lame gradient that we have now.
- **SEO** - adding alt tags to the images and meta tags to heads will be a pretty good thing to do.
- **Website design** - some basic changes, like using a constant margin between elements, etc. I don't have time for it now, but i'm for sure going to do it after the previous points.
- **/snake** - I was thinking about creating a route in which users could train an AI model using client's side JavaScript.
- **premium accounts for /blog users** - sadly, I live in Poland, so the 6$ is actually ~25PLN (and yes, the average monthly income in Poland is 5000PLN, basically everything on the internet costs 4.5 times more for Poles). It kinda is a lot for a teenager without a job like me, and that's why I came up with an idea of premium blog users. Don't get me wrong, I'm not pulling an Elon move (like not allowing free users to view more than 600 posts per day) - this will be more kind of a support button, but with actual pros that would make me feel better for asking folks for money (I think that a support button is a lot better than putting tens of Google's ads on the website).