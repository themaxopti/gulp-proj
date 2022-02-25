const { src, dest, series, watch } = require('gulp')
const sass = require('gulp-sass')
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const sync = require('browser-sync').create()
const minify = require('gulp-minify');


function html() {
  return src('src/**.html')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('dist'))
}

function scss() {
  return src('src/scss/**.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(csso())
    .pipe(concat('index.css'))
    .pipe(dest('dist/css'))
}

function js() {
  return src('src/js/**.js')
    .pipe(concat('index.js'))
    .pipe(minify())
    .pipe(dest('dist'))
    .pipe(sync.stream())
}

function images() {
  return src('src/assets/**/*.{jpg,png,svg,gif,ico,webp}')
    .pipe(dest('dist/assets'))
}

function fonts() {
  return src('src/fonts/**/*.{woff,ttf,eot}')
    .pipe(dest('dist/fonts'))
}

function clear() {
  return del('dist')
}

function serve() {
  sync.init({
    server: './dist',
  })

  watch('src/**.html', series(html)).on('change', sync.reload)
  watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
  watch('src/js/**.js', series(js)).on('change', sync.reload)
  watch('src/assets/**/*.{jpg,png,svg,gif,ico,webp}', series(images)).on('change', sync.reload)
  watch('src/fonts/**/*.{woff,ttf,eot}', series(fonts)).on('change', sync.reload)

}

exports.build = series(clear, scss, html, js, fonts, images)
exports.serve = series(clear, scss, html, js, fonts, images, serve)
exports.clear = clear