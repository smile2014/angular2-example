'use strict';

var argv = require('yargs').argv;
var exec = require('child_process').exec;
var del = require('del');
var gulp = require('gulp');
var os = require('os');

var cleanCss = require('gulp-clean-css');
var concat = require('gulp-concat');
var embedTemplates = require('gulp-angular-embed-templates');
var gulpif = require('gulp-if');
var htmlreplace = require('gulp-html-replace');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var sassLint = require('gulp-sass-lint');
var tslint = require('gulp-tslint');
var typescript = require('gulp-typescript');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');

var Builder = require('systemjs-builder');



/*******************************************************************************
 * The main tasks: clean, build, watch.
 ******************************************************************************/

gulp.task('clean', function () {
    return del([
        './dist/**/*',
        './aot/**/*'
    ]);
});

// Use --production for production build.
gulp.task('build', [
    'js',
    'css',
    'html',
    'copy'
]);

gulp.task('watch', function() {
    gulp.watch([
        './src/sass/**/*.scss', 
        './src/app/**/*.scss'
    ], [
        'lint:sass', 
        'css'
    ]);
    gulp.watch([
        './src/app/**/*.ts', 
        './src/app/**/*.html', 
        '!./src/index.html'
    ], [
        'lint:ts',
        'transpile:ts'
    ]);
    gulp.watch([
        './src/index.html', 
        './test/unit-tests.html'
    ], [
        'html'
    ])
});



/*******************************************************************************
 * Sass/CSS.
 ******************************************************************************/

gulp.task('css', [
    'lint:sass',
    'transpile:sass',
    'vendor:css'
]);

// Lint Sass.
gulp.task('lint:sass', function() {

    return gulp.src(['./src/sass/**/*.scss', './src/app/**/*.scss'])
        .pipe(plumber({
            errorHandler: function (err) {
                console.error('>>> [sass-lint] Sass lint failed'.bold.green);
                this.emit('end');
            }
        }))
        .pipe(sassLint({
            configFile: 'lint-sass.yml'
        }))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError());
});

// Transpile Sass --> CSS.
gulp.task('transpile:sass', ['clean:css'], function() {

    return gulp.src('./src/sass/base.scss')
        .pipe(plumber({
            errorHandler: function (err) {
                console.error('>>> [sass] Sass transpile failed'.bold.green);
                console.error(err);
                this.emit('end');
            }
        }))
        .pipe(gulpif(!argv.production, sourcemaps.init()))
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'compressed'
        }))
        .pipe(rename('style.min.css'))
        .pipe(gulpif(!argv.production, sourcemaps.write('.')))
        .pipe(gulp.dest('dist'));
});

/**
 * Copy vendor css files for which there is no Sass source available (ag-grid).
 */
gulp.task('vendor:css', ['clean:css'], function() {

    return gulp.src([
        './node_modules/ag-grid/dist/styles/ag-grid.css',
        './node_modules/@angular/material/core/theming/prebuilt/deeppurple-amber.css ',
        './node_modules/@angular/material/core/overlay/overlay.css' // temporary for @angular2-material menu and tooltip.
    ])
        .pipe(concat('vendor.css'))
        .pipe(cleanCss())
        .pipe(rename('vendor.min.css'))
        .pipe(gulp.dest('dist'));
});

// Clean CSS.
gulp.task('clean:css', function() {
    return del([
        './dist/*.css',
        './dist/*.css.map'
    ]);
});


/*******************************************************************************
 * Typescript/Javascript.
 ******************************************************************************/

gulp.task('js', [
    'lint:ts',
    'bundle:js',
    'copy:js',
    'vendor:js'
]);

// Lint.
gulp.task('lint:ts', function() {

    return gulp.src("./src/app/**/*.ts")
        .pipe(plumber({
            errorHandler: function (err) {
                console.error('>>> [ts-lint] Typescript lint failed'.bold.green);
                this.emit('end');
            }
        }))
        .pipe(tslint({
            configuration: "lint-ts.json",
            formatter: "verbose" // "prose"
        }))
        .pipe(tslint.report());
});

// Transpile Typescript --> js.
gulp.task('transpile:ts', ['clean:js:app'], function() {
    
    var tsProject = typescript.createProject('tsconfig-jit.json');

    var tsResult = gulp.src(["./src/app/**/*.ts"])
        .pipe(embedTemplates({
            sourceType: 'ts'
        }))
        .pipe(sourcemaps.init())
        .pipe(plumber({
            errorHandler: function(err) {
                console.log('>>> [tsc] Typescript transpile failed'.bold.green);
                this.emit('end');
            }
        }))
        .pipe(tsProject());

    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/app'));
});

// Transpile new, with ngc.
gulp.task('compile:ts', ['clean:js:app'], function (cb) {

    var cmd = os.platform() === 'win32' ? 
        'node_modules\\.bin\\ngc' : './node_modules/.bin/ngc';

    exec(cmd, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

// Add enableProdMode() call for production distribution.
gulp.task('modify:js', ['transpile:ts'], function() {

    var placeholder = '// PRODUCTION_MODE_PLACEHOLDER';
    var value = "var myCore_1 = require('@angular/core');\n" + 
        "myCore_1.enableProdMode();";

    return gulp.src(['./dist/app/main.js'])
        .pipe(gulpif(argv.production, replace(placeholder, value)))
        .pipe(gulp.dest('./dist/app'));
});

// TODO Only for development build?
// Copy ts dependencies.
gulp.task('copy:ts', ['clean:js:node'], function() {

    return gulp.src([
            './node_modules/@angular/**/*',
            './node_modules/ag-grid/**/*',
            './node_modules/ag-grid-ng2/**/*',
            './node_modules/angular2-in-memory-web-api/**/*',
            './node_modules/jasmine-core/**/*',
            './node_modules/moment/**/*',
            './node_modules/rxjs/**/*',
            './node_modules/systemjs/**/*',
        ], {base: 'node_modules'})
        .pipe(gulp.dest('dist/node_modules'));
});

// TODO DEPRICATED.
// Bundle js.
gulp.task('bundle:js', ['copy:ts', 'modify:js'], function() {
    
    if(argv.production) {

        var b = new Builder('./dist', './systemjs.config.js');
        var opts = {
            //minify: true
        };
        
        return b.buildStatic('app', 'dist/app.min.js', opts).then(function() {   
        
            return del([
                './dist/app',
                './dist/node_modules'
            ]);
        }).catch(function(err) {
            console.error('>>> [systemjs] Bundling failed'.bold.green, err);
        });
    }
});

// Copy js (development only, copy systemjs config).
gulp.task('copy:js', ['clean:js'], function() {
    return gulp.src(['systemjs.config.js'])
        .pipe(gulpif(!argv.production, gulp.dest('dist')));
})

// Vendor Javascript.
gulp.task('vendor:js', ['clean:js', 'copy:ts'],  function() {

    return gulp.src([
            './node_modules/core-js/client/shim.min.js',
            './node_modules/zone.js/dist/zone.js',
            './node_modules/reflect-metadata/Reflect.js',
            './node_modules/systemjs/dist/system.src.js'
        ])
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// Clean js.
gulp.task('clean:js', function() {
    return del([
        './dist/*.js',
        './dist/*.js.map'
    ]);
});

gulp.task('clean:js:app', function() {
    return del([
        './dist/app'
    ]);
});

gulp.task('clean:js:node', function() {
    return del([
        './dist/node_modules'
    ]);
});



/*******************************************************************************
 * HTML.
 ******************************************************************************/

gulp.task('html', function() {

    return gulp.src(['./src/index.html'])
        .pipe(gulpif(argv.production, htmlreplace({
            'js': 'app.min.js'
        })))
        .pipe(gulp.dest('dist/'));
});



/*******************************************************************************
 * Copy to dist: HTML, favicon, assets, fonts.
 ******************************************************************************/

gulp.task('copy', [
    'copy:favicon',
    'copy:assets',
    'copy:fonts'
]);

gulp.task('copy:favicon', function() {
    return gulp.src('./src/favicon.ico')
        .pipe(gulp.dest('dist/'));
});

gulp.task('copy:assets', function() {
    return gulp.src([
        './src/assets/**/*'
    ], {base: 'src/assets'})
        .pipe(gulp.dest('dist/assets'));
});

gulp.task('copy:fonts', function() {
    return gulp.src([
            './node_modules/font-awesome/fonts/*',
            './node_modules/open-sans-fontface/fonts/**/*',
            './node_modules/roboto-fontface/fonts/**/*',
            './node_modules/material-design-icons/iconfont/MaterialIcons-Regular*'
        ])
        .pipe(gulp.dest('dist/fonts'));
});



/*******************************************************************************
 * Test
 ******************************************************************************/

// No tests yet.
