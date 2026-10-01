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
    return src("./styles/scss/main.scss", { sourcemaps: true })
        .pipe(sass().on("error", sass.logError))
        .pipe(postcss(PLUGINS))
        .pipe(dest("./styles/css", { sourcemaps: "." }))
        .pipe(brSync.stream());
}

export function stylesMin() {
    return src("./styles/scss/main.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(postcss([...PLUGINS, cssnano()]))
        .pipe(rename({ suffix: ".min" }))
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
