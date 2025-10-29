const {src, dest, watch, series } = require('gulp');
const sass = require('gulp-dart-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browserSync = require('browser-sync');
const browsersync = require('browser-sync').create();

function scssTask () {
    return src ('app/scss/**/*', { sourcemaps: true})
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('dist', { sourcemaps: '.'}));
}

function jsTask () {
    return src('app/js/script.js', {sourcemaps: true}) 
    .pipe(babel({ presets: ['@babel: preset-env']}))
    .pipe(terser())
    .pipe(dest('dist', { sourcemaps: '.'}));
}

function browsersSyncServer (cb) {
    browsersync.init({
        server: {
            baseDir: '.'
        },
        notify: {
            styles: {
                top: 'auto',
                bottom: '0',
            },
        },
    });
    cb();
}
function browserSyncReLoad (cb) {
    browsersync.reload();
    cb();
}

function watchTask () {
    watch('*.html', browserSyncReLoad);
    watch (
        ['app/scss/**/*.scss', 'app//**/*.js'],
        series (scssTask, jsTask, browserSyncReLoad)
    );
} 

exports.default = series (scssTask, jsTask, browsersSyncServer, watchTask);
