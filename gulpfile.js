var gulp = require('gulp');
var runSequence = require("run-sequence");
var path = require('path');
var typescript = require('gulp-typescript');
var tslint = require('gulp-tslint');
var replace = require('gulp-replace');
var shell = require('gulp-shell');
var sourcemaps = require('gulp-sourcemaps');
var jasmine = require('gulp-jasmine');
var jasmineReporters = require('jasmine-reporters');
var del = require('del');
var mergeJson = require('gulp-merge-json');
var karmaServer = require('karma').Server;
var karmaConfig = require('karma').config;
var buildConfig = require('./build.config');
var header = require('gulp-header');
var fs = require('fs');

//------------Main------------

gulp.task('build', [
    'build.tools',
    'build.components',
    'build.examples'
    ]
);

gulp.task('default', ['build']);


//------------Tools------------

gulp.task('build.tools', function() {
    var config = buildConfig.tools;

    return gulp.src(config.srcFilesPattern)
        .pipe(sourcemaps.init())
        .pipe(typescript(config.tsConfigPath))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.distPath));
});


//------------Components------------

gulp.task('clean.metadata', ['build.tools'], function () {
    var outputFolderPath = buildConfig.tools.metadataGenerator.outputFolderPath;

    return del([outputFolderPath]);
});

gulp.task('generate.metadata', ['build.tools', 'clean.metadata'], function () {
    var MetadataGenerator = require(buildConfig.tools.metadataGenerator.importFrom).default,
        generator = new MetadataGenerator();

    generator.generate(buildConfig.tools.metadataGenerator);
});

gulp.task('clean.generatedComponents', function () {
    var outputFolderPath = buildConfig.tools.componentGenerator.outputFolderPath;
    
    return del([outputFolderPath + "/**/*.*"]);
});

gulp.task('generate.components', ['generate.metadata', 'clean.generatedComponents'], function () {
    var DoTGenerator = require(buildConfig.tools.componentGenerator.importFrom).default,
        generator = new DoTGenerator();

    generator.generate(buildConfig.tools.componentGenerator);
});

gulp.task('generate.moduleFacades', ['generate.components'], function () {
    var ModuleFacadeGenerator = require(buildConfig.tools.moduleFacadeGenerator.importFrom).default,
        moduleFacadeGenerator = new ModuleFacadeGenerator();

    moduleFacadeGenerator.generate(buildConfig.tools.moduleFacadeGenerator);
});

gulp.task('generate.facades', ['generate.moduleFacades'], function () {
    var FacadeGenerator = require(buildConfig.tools.facadeGenerator.importFrom).default,
        facadeGenerator = new FacadeGenerator();

    facadeGenerator.generate(buildConfig.tools.facadeGenerator);
});

gulp.task('build.license-headers', function() {
    var config = buildConfig.components,
        pkg = require('./package.json'),
        now = new Date(),
        data = {
            pkg: pkg,
            date: now.toDateString(),
            year: now.getFullYear()
        };

    var banner = [
        '/*!',
        ' * <%= pkg.name %>',
        ' * Version: <%= pkg.version %>',
        ' * Build date: <%= date %>',
        ' *',
        ' * Copyright (c) 2012 - <%= year %> Developer Express Inc. ALL RIGHTS RESERVED',
        ' *',
        ' * This software may be modified and distributed under the terms',
        ' * of the MIT license. See the LICENSE file in the root of the project for details.',
        ' *',
        ' * https://github.com/DevExpress/devextreme-angular',
        ' */',
        '\n' // This new line is necessary to keep the header after TS compilation
        ].join('\n');

    return gulp.src(path.join(config.outputPath, config.srcFilesPattern))
        .pipe(header(banner, data))
        .pipe(gulp.dest(config.outputPath));
});

gulp.task('clean.dist', function () {
    del.sync([buildConfig.components.outputPath + "/*.*"]);
    return del([buildConfig.components.outputPath]);
});

gulp.task('build.ngc', function(done) {
    var config = buildConfig.components,
        buildPath = path.join(config.outputPath, 'tsconfig.json'),
        task = shell.task(['ngc -p ' + buildPath ]);
    
    task(done);
});

gulp.task('build.copy-sources', ['clean.dist'], function() {
    var config = buildConfig.components;

    return gulp.src([path.join(config.sourcePath, '**/*.*')])
        .pipe(gulp.dest(config.outputPath));

});

// Note: workaround for https://github.com/angular/angular-cli/issues/4874
gulp.task('build.remove-unusable-variable', function() {
    var config = buildConfig.components;

    return gulp.src(path.join(config.outputPath, '**/*.js'))
        .pipe(replace(/var.+devextreme\/bundles\/dx\.all.+/g, ''))
        .pipe(gulp.dest(config.outputPath));
});

gulp.task('build.checkMetadata', function(done) {
    if(fs.existsSync(path.resolve(buildConfig.components.outputPath, 'index.metadata.json'))) {
        done();
    } else {
        done("Metadata not generated!");
    }
});

gulp.task('build.components', ['generate.facades'], function(done) {
    runSequence(
        'build.copy-sources',
        'build.license-headers',
        'build.ngc',
        'build.remove-unusable-variable',
        'build.checkMetadata',
        done
    );
});


//------------npm------------

gulp.task('npm.clean', function() {
    var config = buildConfig.npm;

    return del([config.distPath + '/**/*']);
});

gulp.task('npm.content.package', ['npm.clean'], function() {
    var config = buildConfig.npm;

    return gulp.src(config.package)
        .pipe(mergeJson('package.json'))
        .pipe(gulp.dest(config.distPath));
});

gulp.task('npm.content', ['npm.clean', 'npm.content.package'], function() {
    var config = buildConfig.npm;

    return gulp.src(config.content)
        .pipe(gulp.dest(config.distPath));
});

gulp.task('npm.modules', ['npm.clean', 'build.components'], function() {
    var npmConfig = buildConfig.npm,
        cmpConfig = buildConfig.components;

    return gulp.src([path.join(cmpConfig.outputPath, '**/*.{js,d.ts,js.map,metadata.json}')])
        .pipe(gulp.dest(npmConfig.distPath));
});

gulp.task('npm.pack', ['npm.content', 'npm.modules'], shell.task(['npm pack'], { cwd: buildConfig.npm.distPath }));


//------------Examples------------

gulp.task('build.examples', ['build.components'], function () {
    var config = buildConfig.examples;

    return gulp.src([config.appPath + '/*.ts', '!' + config.appPath + '/**/*.d.ts'])
        .pipe(sourcemaps.init())
        .pipe(typescript(config.tsc))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.appPath));
});

gulp.task('watch.examples', function() {
    var config = buildConfig.examples;

    gulp.watch([config.appPath + '/*.ts', '!' + config.appPath + '/*.d.ts'], ['build.examples']);
});


//------------Testing------------

gulp.task('clean.tests', function () {
    var outputFolderPath = buildConfig.components.testsPath;

    return del([outputFolderPath]);
});

gulp.task('build.tests', ['clean.tests', 'generate-component-names'], function() {
    var config = buildConfig.components,
        testConfig = buildConfig.tests;

    return gulp.src(config.tsTestSrc)
        .pipe(sourcemaps.init())
        .pipe(typescript(testConfig.tsConfigPath))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.testsPath));
});

gulp.task('watch.spec', function() {
    gulp.watch(buildConfig.components.tsTestSrc, ['build.tests']);
});

var getKarmaConfig = function(testsPath) {
    const preprocessors = {};
    preprocessors[testsPath] = [ 'webpack' ];
    return karmaConfig.parseConfig(path.resolve('./karma.conf.js'), { 
        files: [{ pattern: testsPath, watched: false }],
        preprocessors: preprocessors
    });
};

gulp.task('test.components', function(done) {
    runSequence(
        'test.components.server',
        'test.components.client',
        done);
});

gulp.task('test.components.client', ['build.tests'], function(done) {
    new karmaServer(getKarmaConfig('./karma.test.shim.js'), done).start();
});

gulp.task('generate-component-names', ['build.tools'], function(done) {
    var ComponentNamesGenerator = require(buildConfig.tools.componentNamesGenerator.importFrom).default;
    var generator = new ComponentNamesGenerator(buildConfig.tools.componentNamesGenerator);

    generator.generate();

    done();
});

gulp.task('test.components.server', ['build.tests'], function(done) {
    new karmaServer(getKarmaConfig('./karma.server.test.shim.js'), done).start();
});

gulp.task('test.components.client.debug', function(done) {
    var config = getKarmaConfig('./karma.test.shim.js');
    config.browsers = [ 'Chrome' ];
    config.singleRun = false;

    new karmaServer(config, done).start();
});

gulp.task('test.components.server.debug', function(done) {
    var config = getKarmaConfig('./karma.server.test.shim.js');
    config.browsers = [ 'Chrome' ];
    config.singleRun = false;

    new karmaServer(config, done).start();
});

gulp.task('test.tools', function(done) {
    var config = buildConfig.tools.tests;

    return gulp.src(config.srcFilesPattern)
        .pipe(jasmine({
            errorOnFail: false,
            reporter: [
                new jasmineReporters.TerminalReporter({
                    verbosity: 1,
                    color: true,
                    showStack: true
                }),
                new jasmineReporters.JUnitXmlReporter({
                    savePath: 'shippable/testresults/tools'
                })
            ]
        }));
});

gulp.task('run.tests', function(done) {
    runSequence(
        ['test.tools', 'test.components'],
        'lint',
        done);
});

gulp.task('test', function(done) {
    runSequence(
        'build', 'build.tests', 'run.tests',
        done);
});

gulp.task('watch.test', function(done) {
    new karmaServer({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});


//------------TSLint------------

gulp.task('lint', function() {
    return gulp.src([path.join(buildConfig.components.sourcePath, buildConfig.components.srcFilesPattern)]
            .concat(buildConfig.components.tsTestSrc)
            .concat(buildConfig.examples.srcFilesPattern)
            .concat(buildConfig.tools.srcFilesPattern)
        )
        .pipe(tslint({
            formatter: 'prose',
            tslint: require('tslint').default,
            rulesDirectory: null,
            configuration: 'tslint.json'
        }))
        .pipe(tslint.report());
});