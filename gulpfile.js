/*eslint-env node */

"use strict";

var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var browserSync = require("browser-sync");
var runSequence = require("run-sequence");
var nunjucksRender = require("gulp-nunjucks-render");

// SASS
gulp.task("sass", function() {
  return gulp.src("src/scss/*.scss")
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass())
    .pipe(plugins.sourcemaps.write({includeContent: false}))
    .pipe(plugins.sourcemaps.init({loadMaps: true})) // Load sourcemaps generated by sass
    .pipe(plugins.autoprefixer({browsers: ["last 2 versions"]}))
    .on("error", plugins.util.log)
    .pipe(plugins.sourcemaps.write("."))
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream())
    .on("error", plugins.util.log);
});

// CSS
gulp.task("css", function() {
  return gulp.src("src/css/*.css")
    .pipe(plugins.csso())
    .pipe(gulp.dest("dist/css"))
    .on("error", plugins.util.log);
});

gulp.task("images", function () {
  return gulp.src("src/images/**/*")
    .pipe(plugins.cache(plugins.imagemin({
      progressive: true,
      interlaced: true,
      // don"t remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest("dist/images"));
});

gulp.task("lint", function() {
  return gulp.src(["src/js/**/*.js"])
    .pipe(plugins.cached("js")) //Process only changed files
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failOnError());
});

gulp.task("nunjucks", function () {
  nunjucksRender.nunjucks.configure(["src/templates/"]);
  return gulp.src("src/templates/index.html")
    .pipe(nunjucksRender())
    .pipe(gulp.dest("src"));
});

// BrowserSync Server
gulp.task("serve", ["sass", "lint", "nunjucks"], function() {
  browserSync.init([
    "src/js/**/*.js",
    "src/*.html"
  ], {
    notify: false,
    server: {
      baseDir: ["src"]
    },
    port: 3000,
    browser: [],
    tunnel: false
  });

  gulp.watch("src/scss/**/*.scss", ["sass"]);
  gulp.watch("src/js/**/*.js", ["lint"]);
  gulp.watch("src/templates/**/*.html", ["nunjucks"]);
});

// Default
gulp.task("default", ["serve"]);

// Copy files to "dist"
gulp.task("files", function () {
  return gulp.src(["src/*.*", "CNAME"], {dot: true}).pipe(gulp.dest("dist"));
});

// Copy fonts to "dist"
gulp.task("fonts", function () {
  return gulp.src("src/fonts/*.*").pipe(gulp.dest("dist/fonts"));
});

// Delete dist Directory
gulp.task("clean", require("del").bind(null, ["dist"]));

gulp.task("jspm", function() {
  return gulp.src("src/jspm_packages/**/*").pipe(gulp.dest("dist/jspm_packages"));
});

gulp.task("js", ["lint"], function() {
  return gulp.src("src/js/**/*.js").pipe(gulp.dest("dist/js"));
});

// Bundle with jspm
gulp.task("bundle", ["js", "jspm"], plugins.shell.task([
  "cd dist; jspm bundle js/main app.js"
]));

gulp.task("html", ["nunjucks"], function() {
  var opts = {
    conditionals: true
  };
  return gulp.src("src/*.html")
    .pipe(plugins.minifyHtml(opts))
    .pipe(gulp.dest("dist"));
});

// Uglify the bundle
gulp.task("uglify", function() {
  return gulp.src("dist/app.js")
    .pipe(plugins.sourcemaps.init({
      loadMaps: true
    }))
    .pipe(plugins.uglify())
    .pipe(plugins.sourcemaps.write("."))
    .pipe(gulp.dest("dist"))
    .on("error", plugins.util.log);
});

gulp.task("gzip", function() {
  return gulp.src("dist/**/*").pipe(plugins.size({title: "build", gzip: true}));
});

gulp.task("push", function() {
  return gulp.src("dist/**/*")
    .pipe(plugins.ghPages({branch: "master"}));
});


gulp.task("build", function() {
  runSequence(
    "clean",
    "files",
    "sass",
    ["fonts", "css", "images", "html", "bundle"],
    "uglify",
    "gzip"
  );
});

gulp.task("deploy", function() {
  runSequence(
    "clean",
    "files",
    "sass",
    ["fonts", "css", "images", "html", "bundle"],
    "uglify",
    "gzip",
    "push"
  );
});
