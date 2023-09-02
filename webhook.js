const express = require('express');
const crypto = require('crypto');
const exec = require('child_process').exec;
const path = require('path');

const app = express();
const port = 3001;

app.use(express.json());


require('dotenv').config({ path: path.resolve(__dirname, 'secrets.env') });
const webhookSecret = process.env.webhook_secret;


function executeCommands(commands) {
    return new Promise((resolve, reject) => {
        for(let i=0; i < commands.length; i++){
            exec(commands[i], (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error while executing commands. Command: ${commands[i]}. Index of the command: ${i}. Error: ${error}.`);
                    reject(error);
                }
    
                else {
                    console.log('Command ran fine, output:', stdout);
                }
            });   
        }
        
        resolve();
    });
}

app.post('/webhook', (req, res) => {
    const signature = req.headers['x-hub-signature-256']; // get the github's signature encoded in sha256 hashing thing
    const payload = JSON.stringify(req.body); // get the body
    const hmac = crypto.createHmac('sha256', webhookSecret); // calculate our own hmac
    const calculatedSignature = 'sha256=' + hmac.update(payload).digest('hex'); // update our hmac with the payload, digest it as hex and then concat 'sha256=' to the start of it.

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(calculatedSignature))) { // verify that the signatures match
        const branch = req.body.ref.split('/').pop(); // get the branch name (eg. ref="refs/head/dev" .split returns ["refs", "head", "dev"] .pop gets the last index "dev")

        if (branch === 'master') {
            // Only trigger actions for the 'master' branch
            executeCommands([
                'git pull origin master', // Pull the repository
                'npm install', // install npm packages
                'pm2 restart all' // restart all node processes
            ]).then(() => {
                console.log('Repository pulled, packages installed (if any new), node.js processes restarted.');
                res.status(200).send('Everything went gut :thumbs_up:. Thanks for the delivery :)');
            }).catch(error => {
                console.error('Error processing webhook:', error);
                res.status(500).send('Something went wrong :/');
            });
        }

        else {
            console.log(`Webhook received for some other branch (${branch}). Ignoring.`);
            res.status(200).send('Everything went gut :thumbs_up:. Thanks for the delivery :)');
        }
    }

    else {
        console.error('Invalid signature. Possible webhook spoofing attempt (bruh).');
        res.status(401).send('Lmao. Invalid signature. IPs noted. Hitman send.');
    }
});

app.listen(port, () => {
    console.log(`webhook waiting for nginx redirects here: http://localhost:${port} 🫡`);
});