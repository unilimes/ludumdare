var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('build:vendors', function () {
    return gulp.src([
        './assets/three/three.js',
        './assets/three/loader/three.mtl.js',
        './assets/three/loader/three.obj.js',
        './assets/three/helpers/three.projector.js',
        './assets/three/helpers/three.objcoord.js',
        './assets/three/controls/three.orbit.js',
        './assets/three/controls/three.transform.js',
        './assets/three/postprocessing/three.oculus.js',

        './public/assets/async/dist/async.min.js',
        './public/assets/jquery/dist/jquery.min.js',
        './public/assets/device.js/lib/device.min.js',
        './public/assets/bootstrap/dist/js/bootstrap.min.js'
    ])
        .pipe(concat('vendors.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('./public/bundle'));
});

gulp.task('build', ['build:vendors']);

gulp.task('default', ['build']);
