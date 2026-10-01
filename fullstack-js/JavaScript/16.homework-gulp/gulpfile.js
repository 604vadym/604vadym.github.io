import gulp from "gulp";
import browserSync from "browser-sync";
import gulpSass from "gulp-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import sortMediaQueries from "postcss-sort-media-queries";
import rename from "gulp-rename";
import cssnano from "cssnano";
import * as sassCompiler from "sass";

const { src, dest, watch, series } = gulp;
const sass = gulpSass(sassCompiler);
const brSync = browserSync.create();

const srcDir = ".";
const destDir = ".";

const PATH = {
    scss: {
        src: `${srcDir}/styles/scss/main.scss`,
        watch: `${srcDir}/styles/scss/**/*.scss`,
        dest: `${destDir}/styles/css`,
    },
    js: {
        src: `${srcDir}/script/main.js`,
        watch: `${srcDir}/script/**/*.js`,
    },
    html: {
        watch: `${srcDir}/*.html`,
    },
};

const PLUGINS = [
    autoprefixer({
        overrideBrowserslist: ["last 2 versions", "> 1%", "not dead"],
        cascade: true,
    }),
    sortMediaQueries({
        sort: "desktop-first",
    }),
];

export function styles() {
    return src(PATH.scss.src, { sourcemaps: true })
        .pipe(sass().on("error", sass.logError))
        .pipe(postcss(PLUGINS))
        .pipe(dest(PATH.scss.dest, { sourcemaps: "." }))
        .pipe(brSync.stream());
}

export function build() {
    return src(PATH.scss.src)
        .pipe(sass().on("error", sass.logError))
        .pipe(postcss([...PLUGINS, cssnano()]))
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest(PATH.scss.dest))
        .pipe(brSync.stream());
}

export function server() {
    brSync.init({
        server: { baseDir: "./" },
        notify: false,
    });
    watch(PATH.scss.watch, styles);
    watch(PATH.html.watch).on("change", brSync.reload);
    watch(PATH.js.watch).on("change", brSync.reload);
}

export default series(styles, server);
