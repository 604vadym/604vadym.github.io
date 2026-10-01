import gulp from "gulp";
import browserSync from "browser-sync";
import gulpSass from "gulp-sass";
import * as sassCompiler from "sass";

const { src, dest, watch, series, parallel } = gulp;
const sass = gulpSass(sassCompiler);
const brSync = browserSync.create();

export function styles() {
    return src("./styles/scss/main.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(dest("./styles/css"))
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
