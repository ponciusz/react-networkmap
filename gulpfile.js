var gulp = require('gulp');
var gutil = require('gulp-util');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var bs = require('browser-sync').create();
var cleanCSS = require('gulp-clean-css');
var cssnano = require('gulp-cssnano');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');


// Declare browsers we need to support. For autoprefixer
var browsers = [
    'last 4 versions',
    'android 4',
    'opera 12',
    'ie 9'
];

// Project paths + vHost domain url (for browserSync)
var base = {
    devUrl: 'http://react.dev',
    src:    'src/',
    dist:   'src/',
    public: '/'
};

var path = {
    styles: {
        src:  base.src + 'scss/',
        dest: base.dist + 'css/'
    }
};


// Compile Sass, Autoprefix and minify
gulp.task('styles', function () {
    return gulp.src(path.styles.src + '*.scss')
        .pipe(plumber(function (error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        .pipe(sass({
            includePaths: [
                '.',
                'bower_components',
                'node_modules/breakpoint-sass/stylesheets'
            ]
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: browsers,
            cascade:  false
        }))
        .pipe(gulp.dest(path.styles.dest))
        .pipe(bs.stream());
});


gulp.task('bs', ['styles'], function () {
    bs.init({
        proxy: base.devUrl
    });
});


gulp.task('default', ['bs'], function () {
    // Watch .scss files
    gulp.watch(path.styles.src + '**/*.scss', ['styles']);
    // Watch Everything else I want
    gulp.watch(['**/*.html', '**/*.php', '**/*.twig']).on('change', bs.reload);
});