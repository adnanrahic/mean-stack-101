var gulp = require('gulp');
var webserver = require('gulp-webserver');
var inject = require('gulp-inject');
var del = require('del');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var bytediff = require('gulp-bytediff');
var cleanCSS = require('gulp-clean-css');

var paths = {
	srcIndex: 'src/index.html',
	src: 'src/**/*',
	tmpIndex: 'tmp/index.html',
	tmp: 'tmp',
	tmpApp: [
		'tmp/app/app.module.js',
		'tmp/app/app.config.js',
		'tmp/app/note/note.module.js',
		'tmp/app/note/note.routes.js',
		'tmp/app/note/note.controller.js',
		'tmp/app/app.run.js'
	],
  dist: 'dist'
}

gulp.task('dev', ['watch']);

gulp.task('watch', ['serve'], function () {
	gulp.watch(paths.src, ['inject']);
});
gulp.task('serve', ['inject'], function () {
  return gulp.src(paths.tmp)
    .pipe(webserver({
      port: 5000,
			livereload: true,
			proxies: [{
				source: '/api',
				target: 'http://localhost:3000/api'
    	}],
      fallback: 'index.html'
    }));
});
gulp.task('inject', ['copy'], function () {
	return gulp.src(paths.tmpIndex)
		.pipe(inject(gulp.src(paths.tmpApp), {
			relative: true
		}))
		.pipe(gulp.dest(paths.tmp));
});
gulp.task('copy', function(){
	return gulp.src(paths.src).pipe(gulp.dest(paths.tmp));
});



/**
 * serve the dist folder - simulate production server
 */
gulp.task('serve:dist', ['build'], function () {
  return gulp.src(paths.dist)
    .pipe(webserver({
      port: 3001,
      fallback: 'index.html'
    }));
});
/**
 * concat & minify app files
 */
gulp.task('build', function () {

	var favicon = gulp.src(paths.favicon).pipe(gulp.dest(paths.dist));
	var distAssets = gulp.src(paths.assets).pipe(gulp.dest(paths.distAssets));
	var distTemplates = gulp.src(paths.templates).pipe(gulp.dest(paths.dist));

  var dist = gulp.src(paths.appSrc)
		.pipe(sourcemaps.init())
		.pipe(concat('app.min.js'))
		.pipe(ngAnnotate())
		.pipe(bytediff.start())
		.pipe(uglify({
				mangle: true
		}))
		.pipe(bytediff.stop())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.dist));

  
  // need the index from the dist directory!!!!
  return gulp.src(paths.index)
		.pipe(gulp.dest(paths.dist))
		.pipe(inject(distAssets, {
				relative: true,
				empty: true,
				name: 'assetsInject'
		}))
		.pipe(inject(dist, {
				relative: true,
				empty: true
		}))
		.pipe(gulp.dest(paths.dist));

});

/**
 * clean tasks
 */
gulp.task('clean', function () {
  del([paths.tmp, paths.dist]);
});
gulp.task('clean:tmp', function () {
  del([paths.tmp]);
});
gulp.task('clean:dist', function () {
  del([paths.dist]);
});