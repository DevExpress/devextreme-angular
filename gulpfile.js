var gulp = require('gulp');
var tslint = require('gulp-tslint');

const srcFilesPattern = ['packages/*/src/**/*.ts', '!packages/*/src/ui/**', '!packages/*/src/metadata-model.ts'];
const sandboxSrcFilesPattern = 'packages/sandbox/**/*.ts';
const testsFilesPattern = ['packages/*/tests/src/**/*.spec.ts', 'packages/*/tests/src/**/component-names.ts'];


gulp.task('lint', function() {
    return gulp.src(srcFilesPattern
            .concat(sandboxSrcFilesPattern)
            .concat(testsFilesPattern)
        )
        .pipe(tslint({
            formatter: 'prose',
            tslint: require('tslint').default,
            rulesDirectory: null,
            configuration: 'tslint.json'
        }))
        .pipe(tslint.report());
});
