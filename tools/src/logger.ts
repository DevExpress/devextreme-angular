/// <reference path="../../typings/globals/node/index.d.ts" />

let argv = require('yargs')
    .default('verbose', false)
    .argv;

export default function(...any) {
    if (argv.verbose) {
        console.log.apply(console, arguments);
    }
};
