'use strict'

import {src, dest, watch, parallel, series} from 'gulp'
import cssMin from 'gulp-clean-css'
import concat from 'gulp-concat'
import googleWebFonts from 'gulp-google-webfonts'
import imageMin from 'gulp-imagemin'
import merge from 'merge-stream'
import plumber from 'gulp-plumber'
import prefixer from 'gulp-autoprefixer'
import rimraf from 'rimraf'
import sass from 'gulp-sass'
import uglify from 'gulp-uglify-es'
import sourceMaps from 'gulp-sourcemaps'
import notify from 'gulp-notify'
import browserSync from 'browser-sync'
import browserify from 'browserify'
import babelify from 'babelify'
import source from 'vinyl-source-stream'

const reload = browserSync.reload
const dir = {
    src: 'src/',
    build: 'build/',
    nm: 'node_modules/'
}

const path = {
    build: {
        html: dir.build,
        js: `${dir.build}js/`,
        jsx: `${dir.build}js/`,
        css: `${dir.build}css/`,
        img: `${dir.build}img/`,
        fonts: `${dir.build}fonts/`
    },
    src: {
        html: `${dir.src}*.html`,
        js: [
            `${dir.nm}jquery/dist/jquery.min.js`,
            `${dir.nm}bootstrap/dist/js/bootstrap.bundle.min.js`,
            `${dir.src}js/partials/wow.js`,
            `${dir.src}js/partials/helper.js`
        ],
        jsx: `${dir.src}js/react/**/*.js`,
        style: `${dir.src}style/main.scss`,
        img: `${dir.src}img/**/*.*`,
        fonts: `${dir.src}fonts/**/*.*`,
        fontAwesome: `${dir.nm}@fortawesome/fontawesome-free/webfonts/*.*`
    },
    watch: {
        html: `${dir.src}**/*.html`,
        js: `${dir.src}js/partials/**/*.js`,
        jsx: `${dir.src}js/react/**/*.js`,
        style: `${dir.src}style/**/*.scss`,
        img: `${dir.src}img/**/*.*`,
        fonts: `${dir.src}fonts/**/*.*`
    },
    clean: './build'
}
const config = {
    server: {
        baseDir: "./build"
    },
    //tunnel: true,
    host: 'localhost',
    port: 3000,
    logPrefix: "WebDev",
    browserify: {
        entries: './src/js/react/index.js',
        extensions: ['.js'],
        debug: true
    },
    babelify: {
        presets: ['env', 'react'],
        plugins: ['transform-class-properties']
    },
    googleFonts: {
        options: {
            // fontsDir: 'googlefonts/',
            // cssDir: 'googlecss/',
            // cssFilename: 'googlefonts.css'
        }
    }
}

export const webServer = (cb) => browserSync(config)

export const clean = (cb) => rimraf(path.clean, cb)

export const htmlBuild = () => src(path.src.html)
    .pipe(dest(path.build.html))
    .pipe(reload({stream: true}))

export const jsBuild = () => src(path.src.js)
    .pipe(plumber())
    .pipe(sourceMaps.init())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(sourceMaps.write('.'))
    .pipe(plumber.stop())
    .pipe(dest(path.build.js))
    .pipe(reload({stream: true}))

export const jsxBuild = () => browserify(config.browserify)
    .transform('babelify', config.babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(dest(path.build.jsx))
    //.pipe(reload({stream: true}))

export const cssBuild = () => src(path.src.style)
    .pipe(sourceMaps.init())
    .pipe(sass({
        includePaths: ['src/style/'],
        outputStyle: 'compressed',
        sourceMap: true,
        errLogToConsole: true
    }).on("error", notify.onError(function (error) {
        return "Error: " + error.message;
    })))
    .pipe(prefixer())
    .pipe(cssMin())
    .pipe(sourceMaps.write('.'))
    .pipe(dest(path.build.css))
    .pipe(reload({stream: true}))

export const imagesBuild = () => src(path.src.img)
    .pipe(imageMin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        interlaced: true
    }))
    .pipe(dest(path.build.img))
    .pipe(reload({stream: true}))

export const fontsBuild = () => {
    let google = src('./fonts.list')
        .pipe(googleWebFonts(config.googleFonts.options))
        .pipe(dest(path.build.fonts));

    let fontAwesome = src(path.src.fontAwesome)
        .pipe(dest(path.build.fonts));

    return merge(google, fontAwesome);
}

export const devWatch = () => {
    watch(path.watch.style, cssBuild);
    watch(path.watch.jsx, jsxBuild);
    watch(path.watch.js, jsBuild);
    watch(path.watch.html, htmlBuild);
    //watch(path.watch.fonts, fontsBuild);
    watch(path.watch.img, imagesBuild);
}
export const doBuild = parallel(htmlBuild, jsxBuild, jsBuild, cssBuild)

export const dev = parallel(doBuild, webServer, devWatch)

export default dev;