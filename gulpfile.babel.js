import gulp from "gulp";
import { spawn } from "child_process";
import hugoBin from "hugo-bin";
import gutil from "gulp-util";
import flatten from "gulp-flatten";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import webpackConfig from "./webpack.config.js";
import sass from "gulp-sass";
import ProgressPlugin from 'webpack/lib/ProgressPlugin';
import rsync from 'gulp-rsync';
import rm from 'gulp-rm';

const browserSync = BrowserSync.create();

// Hugo arguments
const hugoArgsDefault = ["-d", "./build", "-s", "site", "-v"];

// Hugo tasks
gulp.task("hugo", ["hugo-build", "hugo-sync"])
gulp.task("hugo-prod", ["hugo-build-prod", "hugo-sync"]);

// Build tasks
gulp.task("hugo-build", (cb) => buildSite(cb));
gulp.task("hugo-build-prod", (cb) => buildSite(cb, [], "production"));

// Build/production task
gulp.task("build", ["css", "js-prod", "fonts", "hugo-prod"]);

// Compile SCSS with gulp-sass
gulp.task("css", () => (
  gulp.src("./src/scss/*.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream())
));

// Compile Javascript
gulp.task("js", (cb) => {
  const myConfig = Object.assign({}, webpackConfig);
  myConfig.mode = 'development';

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true,
      progress: true
    }));
    browserSync.reload();
    cb();
  });
});

// Compile Javascript for production
gulp.task("js-prod", (cb) => {
  const myConfig = Object.assign({}, webpackConfig);
  myConfig.mode = 'production';
  myConfig.devtool = false;

  var compiler = webpack(myConfig);
  compiler.apply(new ProgressPlugin(function(percentage, msg) {
    gutil.log("[webpack]", (percentage * 100) + '%', msg);
  }));

  compiler.run((err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true,
      progress: true
    }));
    browserSync.reload();
    cb();
  });
});

// Move all fonts in a flattened directory
gulp.task('fonts', () => (
  gulp.src("./src/fonts/**/*")
    .pipe(flatten())
    .pipe(gulp.dest("./dist/fonts"))
    .pipe(browserSync.stream())
));

// Development server with browsersync
gulp.task("server", ["hugo", "css", "js", "fonts"], () => {
  browserSync.init({
    server: {
      baseDir: "./dist",
      serveStaticOptions: {
          extensions: ["html"]
      }
    }
  });
  gulp.watch("./src/js/**/*.js", ["js"]);
  gulp.watch("./src/scss/*.scss", ["css"]);
  gulp.watch("./src/fonts/**/*", ["fonts"]);
  gulp.watch(["./site/**/*", "!./site/build/"], ["hugo"]);
});

// Sync hugo-built files to dist directory
gulp.task("hugo-sync", ["hugo-build"], () => {
  gulp.src('./site/build/')
    .pipe(rsync({
      root: './site/build/',
      destination: './dist',
      recursive: true,
      clean: true,
      silent: true,
      links: true,
      // Don't delete files created by css/js/fonts tasks
      exclude: ['css/', 'js/', 'fonts/', '*.bundle.js', '*.bundle.js.map'],
    }));
});

gulp.task("clean", () => {
  gulp.src(["./site/build/**/*", "./site/build/**/.*", "./dist/**/.*", "./dist/**/*"], { read: false })
    .pipe(rm())
});

/**
 * Run hugo and build the site
 */
function buildSite(cb, options, environment = "development") {
  const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault;

  process.env.NODE_ENV = environment;

  return spawn(hugoBin, args, {stdio: "inherit"}).on("close", (code) => {
    if (code === 0) {
      browserSync.reload();
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}