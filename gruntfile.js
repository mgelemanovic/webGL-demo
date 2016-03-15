module.exports = function (grunt) {
    grunt.initConfig({
        // Define source files and their destination
        uglify: {
            files: {
                src: 'src/**/*.js',
                dest: 'dist/game.min.js'
            }
        },
        watch: {
            js: {files: 'src/**/*.js', tasks: ['uglify']},
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Register at least this one task
    grunt.registerTask('default', ['uglify']);
};