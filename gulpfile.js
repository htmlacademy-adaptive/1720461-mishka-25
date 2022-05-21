import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import csso from 'postcss-csso';
import del from 'del';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';


// Clean
const clean = () => {
  return del('build');
};


// Copy
const copy = (done) => {
  gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico',
    'source/*.webmanifest',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}


//HTML
const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build'));
}


// Styles
export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    // .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(gulp.dest('source/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}


// Scripts
const scripts = () => {
  return gulp.src('source/js/script.js')
  .pipe(terser())
  .pipe(rename('script.min.js'))
  .pipe(gulp.dest('build/js'));
}


// Images
const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'));
}


const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(gulp.dest('build/img'));
}


// WebP
const createWebp_products = () => {
  return gulp.src('source/img/products/*.{jpg,png}')
  .pipe(squoosh( {
    webp: {}
  }))
  .pipe(gulp.dest('build/img/products'));
}

const createWebp_content_images = () => {
  return gulp.src('source/img/content-images/*.{jpg,png}')
  .pipe(squoosh( {
    webp: {}
  }))
  .pipe(gulp.dest('build/img/content-images'));
}


// SVG
const svg = () => {
  return gulp.src(['source/img/**/*.svg', '!source/img/icons/*.svg', '!source/img/sprite.svg'])
  .pipe(svgmin())
  .pipe(gulp.dest('build/img'));
}


const sprite = () => {
  return gulp.src('source/img/icons/*.svg')
    .pipe(svgmin())
    .pipe(svgstore( {
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'))
}


// Server
const server = (done) => {
  browser.init({
    server: {
      // baseDir: 'build'
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}


// Watcher
const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
  gulp.watch('source/js/*.js', gulp.series(scripts));
}


// Build
export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    html,
    styles,
    scripts,
    createWebp_products,
    createWebp_content_images,
    svg,
    sprite,
  )
);


// Source
export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    html,
    styles,
    scripts,
    createWebp_products,
    createWebp_content_images,
    svg,
    sprite,
  ),
  gulp.series (
    server,
    watcher
  ));
