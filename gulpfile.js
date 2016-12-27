require('./local.env.js');

var gulp =require('gulp');
    nodemon = require('gulp-nodemon');

var port = process.env.PORT || 5000;

gulp.task('default', function(){
    nodemon({
        script: 'mainDev.js',
        ext: 'js',
        env: {
            PORT: port
        },
        ignore:['./node_modules/**']
        
    })
    .on('start', function(){
        console.log('TunariApp server is listening at %s in development mode', port);
    })
    .on('restart', function(){
        console.log('Files have been updated succesfully');
    });
});
