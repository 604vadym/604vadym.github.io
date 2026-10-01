import gulp from "gulp";
import gulpSass from "gulp-sass";
import * as sassCompiler from "sass";

const { src, dest, watch, series, parallel } = gulp;
const sass = gulpSass(sassCompiler);

export function styles() {
    return src("./styles/scss/main.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(dest("./styles/css"));
}

export function server() {
    watch("./styles/scss/**/*.scss", styles);
}

export default series(styles, server);
