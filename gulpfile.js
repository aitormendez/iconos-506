const
  gulp = require('gulp'),
  rename = require('gulp-rename'),
  sketch = require('gulp-sketch'),
  iconfont = require('gulp-iconfont'),
  consolidate = require('gulp-consolidate'),
  async = require('async'),
  runTimestamp = Math.round(Date.now()/1000)

/**
 * Font settings
 */
const
  // set name of your symbol font
  fontName = 'iconos-506',
  // set class name in your CSS
  className = 's',
  // you can also choose 'foundation-style'
  template = 'fontawesome-style',
  // you can also choose 'symbol-font-16px.sketch'
  skethcFileName = 'iconos.sketch'

/**
 * Recommended to get consistent builds when watching files
 * See https://github.com/nfroidure/gulp-iconfont
 */
const timestamp = Math.round(Date.now() / 1000)

gulp.task('symbols', () =>
  gulp.src('assets/sketch/iconos.sketch')
    .pipe(sketch({
      export: 'artboards',
      formats: 'svg'
    }))
    .pipe(gulp.dest('dist/SVGs/')) // salvar los SVG en una carpeta (aunque no es necesario)
    .pipe(iconfont({
      fontName,
      prependUnicode: true,
      formats: ['ttf', 'eot', 'woff', 'woff2'],
      timestamp,
      //log: () => {} // suppress unnecessary logging
    }))
    .on('glyphs', (glyphs) => {
      const options = {
        className,
        fontName,
        fontPath: '../fonts/', // set path to font (from your CSS file if relative)
        glyphs: glyphs.map(mapGlyphs)
      }
      gulp.src(`assets/templates/${ template }.css`)
        .pipe(consolidate('lodash', options))
        .pipe(rename({ basename: fontName }))
        .pipe(gulp.dest('dist/css/')) // set path to export your CSS

      // if you don't need sample.html, remove next 4 lines
      gulp.src(`assets/templates/${ template }.html`)
        .pipe(consolidate('lodash', options))
        .pipe(rename({ basename: 'sample' }))
        .pipe(gulp.dest('dist/')) // set path to export your sample HTML
    })
    .pipe(gulp.dest('dist/fonts/')) // set path to export your fonts
)

gulp.task('watch', () => gulp.watch('assets/sketch/*.sketch', ['symbols']))

/**
 * This is needed for mapping glyphs and codepoints.
 */
function mapGlyphs(glyph) {
  return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) }
}
