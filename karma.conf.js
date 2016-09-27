module.exports = function(config) {
    config.set({

        basePath: './',

        frameworks: ['jasmine', 'sinon'],

        files: [
            // System.js for module loading
            'node_modules/systemjs/dist/system.src.js',

            // Polyfills
            'node_modules/core-js/client/shim.js',

            // Reflect and Zone.js
            'node_modules/zone.js/dist/zone.js',
            'node_modules/zone.js/dist/long-stack-trace-zone.js',
            'node_modules/zone.js/dist/proxy.js',
            'node_modules/zone.js/dist/sync-test.js',
            'node_modules/zone.js/dist/jasmine-patch.js',
            'node_modules/zone.js/dist/async-test.js',
            'node_modules/zone.js/dist/fake-async-test.js',

            // RxJs
            { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
            { pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },

            // Angular 2 itself and the testing library
            {pattern: 'node_modules/@angular/**/*.js', included: false, watched: false},
            {pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: false},

            // DevExtreme
            { pattern: 'node_modules/jquery/dist/jquery.js', included: true, watched: false},
            { pattern: 'node_modules/devextreme/dist/js/dx.all.debug.js', included: true, watched: false },
            { pattern: 'dist/**/*.js', included: false, watched: true },

            { pattern: 'node_modules/systemjs/dist/system-polyfills.js', included: false, watched: false }, // PhantomJS2 require it

            // Karma config
            {pattern: 'karma.systemjs.conf.js', included: false, watched: false},
            {pattern: 'karma.test.shim.js', included: true, watched: true},

            // Tests
            {pattern: 'tests/dist/**/*.js', included: false, watched: true},

            // paths to support debugging with source maps in dev tools
            {pattern: 'tests/dist/**/*.ts', included: false, watched: true},
            {pattern: 'tests/dist/**/*.js.map', included: false, watched: true}
        ],

        // proxied base paths
        proxies: {
            // required for component assests fetched by Angular's compiler
            '/src/': '/base/src/'
        },

        port: 9876,

        logLevel: config.LOG_ERROR,

        colors: true,

        autoWatch: true,

        browsers: ['PhantomJS2'],

        reporters: [
            'progress',
            'junit'
        ],

        junitReporter: {
            outputDir: 'shippable/testresults/',
            outputFile: 'test-results.xml'
        },

        // Karma plugins loaded
        plugins: [
            'karma-jasmine',
            'karma-sinon',
            'karma-coverage',
            'karma-junit-reporter',
            'karma-phantomjs2-launcher',
            'karma-chrome-launcher'
        ],

        singleRun: true,

        concurrency: Infinity
    })
};
