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
import minify from 'gulp-minifier';

const browserSync = BrowserSync.create();

// Hugo arguments
const hugoArgsDefault = ["-d", "./build", "-s", "site", "-v"];

// Build tasks
gulp.task("hugo-build", (cb) => buildSite(cb));
gulp.task("hugo-build-prod", (cb) => buildSite(cb, [], "production"));


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

// Sync hugo-built files to dist directory
gulp.task("hugo-sync", () =>
  gulp.src('./site/build/')
    .pipe(rsync({
      root: './site/build/',
      destination: './dist',
      recursive: true,
      clean: true,
      silent: true,
      links: true,
      // Don't delete files created by css/js/fonts tasks
      exclude: ['/css/*', '/*.js', '/*.js.map', '/fonts/*'],
    }))
);

gulp.task("clean", () =>
  gulp.src(["./site/build/**/*", "./site/build/**/.*", "./dist/**/.*", "./dist/**/*"], { read: false })
    .pipe(rm())
);

gulp.task('minify', () =>
  gulp.src('dist/**/*').pipe(minify({
    minify: true,
    minifyHTML: {
      removeComments: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
    },
    minifyCSS: true,
    minifyJS: false,
  })).pipe(gulp.dest('dist'))
);

// Hugo tasks
gulp.task("hugo", gulp.series("hugo-build", "hugo-sync"));
gulp.task("hugo-prod", gulp.series("hugo-build-prod", "hugo-sync"));

// Build/production task
gulp.task("build", gulp.series(gulp.parallel("css", "js-prod", "fonts", "hugo-prod"), "minify"));

// Development server with browsersync
gulp.task("server", gulp.series(gulp.parallel("hugo", "css", "js", "fonts"), () => {
  browserSync.init({
    server: {
      baseDir: "./dist",
      serveStaticOptions: {
          extensions: ["html"]
      }
    }
  });
  gulp.watch("./src/js/**/*.js", gulp.parallel("js"));
  gulp.watch("./src/scss/*.scss", gulp.parallel("css"));
  gulp.watch("./src/fonts/**/*", gulp.parallel("fonts"));
  gulp.watch(["./site/**/*", "!./site/build/**/*"], gulp.parallel("hugo"));
}));

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