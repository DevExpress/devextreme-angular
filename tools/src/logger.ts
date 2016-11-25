import yargs = require('yargs');

let argv = yargs
    .default('verbose', false)
    .argv;

export default function(...any) {
    if (argv.verbose) {
        console.log.apply(console, arguments);
    }
};
