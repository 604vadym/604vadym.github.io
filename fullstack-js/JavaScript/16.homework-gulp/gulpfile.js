import gulp from "gulp";
import browserSync from "browser-sync";
import gulpSass from "gulp-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import * as sassCompiler from "sass";

const { src, dest, watch, series, parallel } = gulp;
const sass = gulpSass(sassCompiler);
const brSync = browserSync.create();

const PLUGINS = [
    autoprefixer({
        overrideBrowserslist: ["last 2 versions", "> 1%", "not dead"],
        cascade: true,
    }),
];

export function styles() {
    return src("./styles/scss/main.scss", { sourcemaps: true })
        .pipe(sass().on("error", sass.logError))
        .pipe(postcss(PLUGINS))
        .pipe(dest("./styles/css", { sourcemaps: "." }))
        .pipe(brSync.stream());
}

export function server() {
    brSync.init({
        server: { baseDir: "./" },
        notify: false,
    });
    watch("./styles/scss/**/*.scss", styles);
    watch("./*.html").on("change", brSync.reload);
    watch("./script/**/*.js").on("change", brSync.reload);
}

export default series(styles, server);
