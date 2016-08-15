var gulp = require('gulp');
var path = require('path');
var typescript = require('gulp-typescript');
var tsc = require('typescript');
var tslint = require("gulp-tslint");
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var shell = require('gulp-shell');
var sourcemaps = require('gulp-sourcemaps');
var jasmine = require('gulp-jasmine');
var del = require('del');
var merge = require("merge-stream");
var karmaServer = require('karma').Server;
var buildConfig = require("./build.config");

//------------Main------------

gulp.task('build', [
    'build.tools',
    'build.components',
    'build.examples'
    ]
);


//------------Tools------------

gulp.task('build.tools', function() {
    var config = buildConfig.tools;

    var tsResult = gulp.src(config.srcFilesPattern)
        .pipe(sourcemaps.init())
        .pipe(typescript(config.tsc));

    return merge([
        tsResult.dts.pipe(gulp.dest(config.distPath)),
        tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.distPath))
    ]);
});


//------------Components------------

gulp.task("generate.metadata", ['build.tools'], function() {
    var MetadataGenerator = require(buildConfig.tools.metadataGenerator.importFrom).default,
        generator = new MetadataGenerator();

    generator.generate(buildConfig.tools.metadataGenerator);
});

gulp.task("generate.components", ['generate.metadata'], function() {
    var DoTGenerator = require(buildConfig.tools.componentGenerator.importFrom).default,
        generator = new DoTGenerator();

    generator.generate(buildConfig.tools.componentGenerator);
});

gulp.task("generate.facades", ['generate.components'], function() {
    var FacadeGenerator = require(buildConfig.tools.facadeGenerator.importFrom).default,
        generator = new FacadeGenerator();

    generator.generate(buildConfig.tools.facadeGenerator);
});

gulp.task('build.components', ['generate.components', 'generate.facades'], function() {
    var config = buildConfig.components;

    var tsProject = typescript.createProject(config.tsConfigPath, {
        typescript: tsc
    });

    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject));

    return merge([
        tsResult.dts.pipe(gulp.dest(config.outputPath)),
        tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.outputPath))
    ]);

});


//------------npm------------

gulp.task('npm.clean', function() {
    var config = buildConfig.npm;

    return del([config.distPath + '/**/*']);
});

gulp.task('npm.content', ['npm.clean'], function() {
    var config = buildConfig.npm;

    return gulp.src(config.content)
        .pipe(gulp.dest(config.distPath));
});

gulp.task('npm.sources', ['npm.clean'], function() {
    var npmConfig = buildConfig.npm,
        cmpConfig = buildConfig.components;

    return gulp.src(cmpConfig.srcFilesPattern)
        .pipe(gulp.dest(path.join(npmConfig.distPath, npmConfig.sourcesTargetFolder)));
});

gulp.task('npm.modules', ['npm.clean', 'build.components'], function() {
    var npmConfig = buildConfig.npm,
        cmpConfig = buildConfig.components;

    return gulp.src(cmpConfig.outputPath + "/**/*")
        .pipe(gulp.dest(npmConfig.distPath));
});

gulp.task('npm.pack', ['npm.content', 'npm.sources', 'npm.modules'], shell.task(['npm pack'], { cwd: buildConfig.npm.distPath }));


//------------Examples------------

gulp.task('build.examples', ['build.components'], function() {
    var config = buildConfig.examples;

    var tsResult = gulp.src([config.appPath + '/*.ts', '!' + config.appPath + '/**/*.d.ts'])
        .pipe(sourcemaps.init())
        .pipe(typescript(config.tsc));

    return merge([
        tsResult.dts.pipe(gulp.dest(config.appPath)),
        tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.appPath))
    ]);
});

gulp.task('watch.examples', function() {
    var config = buildConfig.examples;

    gulp.watch([config.appPath + '/*.ts', '!' + config.appPath + '/*.d.ts'], ['build.examples']);
});


//------------Testing------------

gulp.task('build.tests', ['build.components'], function() {
    var config = buildConfig.components,
        testConfig = buildConfig.tests;

    var tsResult = gulp.src(config.tsTestSrc)
        .pipe(sourcemaps.init())
        .pipe(typescript(testConfig.tsc));

    return merge([
        tsResult.dts.pipe(gulp.dest(config.testsPath)),
        tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.testsPath))
    ]);
});

gulp.task('watch.spec', function(){
    gulp.watch(buildConfig.components.tsTestSrc, ['build.tests']);
});

gulp.task('test.components', ['build.tests'], function(done){
    new karmaServer({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});

gulp.task('test.components.debug', ['build.tests'], function(done){
    new karmaServer({
        configFile: __dirname + '/karma.conf.js',
        browsers: [ 'Chrome' ],
        singleRun: false
    }, done).start();
});

gulp.task('test.tools', ['build.tools'], function(done){
    gulp.src('tools/spec/tests/*.spec.js')
        .pipe(jasmine());
});

gulp.task('test', ['test.tools', 'test.components', 'lint'], function(done){
});

gulp.task('watch.test', function(done){
    new karmaServer({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});


//------------TSLint------------

gulp.task("lint", function(){
    gulp.src(buildConfig.components.srcFilesPattern.concat(buildConfig.tools.srcFilesPattern).concat(buildConfig.examples.srcFilesPattern))
        .pipe(tslint({
            tslint: require('tslint').default,
            rulesDirectory: null,
            configuration: "tslint.json"
        }))
        .pipe(tslint.report("prose"));
});