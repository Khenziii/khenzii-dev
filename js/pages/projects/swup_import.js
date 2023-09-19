import Swup from 'swup';
import SwupScriptsPlugin from '@swup/scripts-plugin';

const swup = new Swup({
    plugins: [new SwupScriptsPlugin({
        head: true,
        body: true
    })]
});